import ExchangeRequest from '../models/ExchangeRequest.js';
import User from '../models/user.model.js';
import Skill from '../models/skill.model.js';
import asyncHandler from 'express-async-handler';
import Notification from '../models/NotificationModel.js';
import { getIO } from '../socket/socketMiddleware.js'
import Question from '../models/Question.js';

// Send Exchange Request
export const sendExchangeRequest = asyncHandler(async (req, res) => {
    const { receiverId, senderSkill, receiverSkill, message } = req.body;

    if (!receiverId || !senderSkill || !receiverSkill) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (receiverId === req.user.id) {
        return res.status(400).json({ message: 'You cannot send a request to yourself' });
    }

    const senderHasSkill = await Skill.findOne({ _id: senderSkill, user: req.user.id });
    if (!senderHasSkill) {
        return res.status(400).json({ message: 'You do not have the skill you are offering to exchange' });
    }

    const receiverHasSkill = await Skill.findOne({
        _id:
            receiverSkill, user: receiverId
    });
    if (!receiverHasSkill) {
        return res.status(400).json({ message: 'Receiver does not have the skill you want' });
    }

    const existingRequest = await ExchangeRequest.findOne({
        sender: req.user.id,
        receiver: receiverId,
        senderSkill,
        receiverSkill,
        status: { $in: ['Pending', 'Accepted'] }
    });

    if (existingRequest) {
        return res.status(400).json({ message: 'Exchange request already exists or is pending/accepted' });
    }
    const exchangeRequest = await ExchangeRequest.create({
        sender: req.user.id,
        receiver: receiverId,
        senderSkill,
        receiverSkill,
        message
    });

    const notification = await Notification.create({
        sender: req.user.id,
        recipient: receiverId,
        type: 'exchange-request',
        message: `${req.user.name} sent you an exchange request`,
        requestId: exchangeRequest._id
    });

    //  Emit to receiver
    getIO().to(receiverId).emit('newNotification', notification);

    res.status(201).json({ message: 'Exchange request sent successfully', exchangeRequest });
});


// Accept Exchange Request
export const acceptExchangeRequest = asyncHandler(async (req, res) => {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: 'Exchange request not found' });

    if (request.receiver.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    if (request.status !== 'Pending') {
        return res.status(400).json({ message: `Request already ${request.status.toLowerCase()}` });
    }

    request.status = 'Accepted';
    await request.save();

    // Notification to sender (request accepted)
    const notifySender = await Notification.create({
        sender: req.user.id,
        recipient: request.sender,
        type: 'exchange-accepted',
        message: `${req.user.name} accepted your exchange request`,
        requestId: request._id
    });


    const notifyReceiver = await Notification.create({
        sender: req.user.id,
        recipient: req.user.id,
        type: 'exchange-accepted',
        message: `You accepted the exchange request from ${request.sender}`,
        requestId: request._id
    });

    getIO().to(request.sender.toString()).emit('newNotification', notifySender);
    getIO().to(req.user.id).emit('newNotification', notifyReceiver);

    res.status(200).json({ message: 'Exchange request accepted' });
});


// Reject Exchange Request
export const rejectExchangeRequest = asyncHandler(async (req, res) => {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: 'Exchange request not found' });

    if (request.receiver.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    if (request.status !== 'Pending') {
        return res.status(400).json({ message: `Request already ${request.status.toLowerCase()}` });
    }

    request.status = 'Rejected';
    await request.save();
    const notifySender = await Notification.create({
        sender: req.user.id,
        recipient: request.sender,
        type: 'exchange-rejected',
        message: `${req.user.name} rejected your exchange request`,
        requestId: request._id
    });

    // Emit to sender only
    getIO().to(request.sender.toString()).emit('newNotification', notifySender);

    res.status(200).json({ message: 'Exchange request rejected' });
});


// Complete Exchange Request

export const completeExchangeRequest = asyncHandler(async (req, res) => {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: 'Exchange request not found' });

    if (
        request.sender.toString() !== req.user.id &&
        request.receiver.toString() !== req.user.id
    ) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    if (request.status !== 'Accepted') {
        return res.status(400).json({ message: 'Only accepted requests can be completed' });
    }

    request.status = 'Completed';
    await request.save();

    res.status(200).json({ message: 'Exchange marked as completed' });
});

//  Get all exchange requests of current user 
export const getMyExchangeRequests = async (req, res) => {
    try {
        const sentRequests = await ExchangeRequest.find({ sender: req.user.id })
            .populate('receiver senderSkill receiverSkill', 'name email')
            .sort({ createdAt: -1 });

        const receivedRequests = await ExchangeRequest.find({ receiver: req.user.id })
            .populate('sender senderSkill receiverSkill', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            sent: sentRequests,
            received: receivedRequests
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get exchange request counts by status
export const getExchangeRequestCounts = async (req, res) => {
    const userId = req.user._id;

    try {
        const matchUser = { $or: [{ sender: userId }, { receiver: userId }] };

        const pendingCount = await ExchangeRequest.countDocuments({ ...matchUser, status: 'Pending' });
        const acceptedCount = await ExchangeRequest.countDocuments({ ...matchUser, status: 'Accepted' });
        const rejectedCount = await ExchangeRequest.countDocuments({ ...matchUser, status: 'Rejected' });
        const completedCount = await ExchangeRequest.countDocuments({ ...matchUser, status: 'Completed' });

        res.json({
            pending: pendingCount,
            accepted: acceptedCount,
            rejected: rejectedCount,
            completed: completedCount
        });
    } catch (error) {
        console.error('Error fetching request counts:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const submitAnswers = asyncHandler(async (req, res) => {
  const { requestId, answers } = req.body;

  const exchangeRequest = await ExchangeRequest.findById(requestId);
  if (!exchangeRequest) {
    res.status(404);
    throw new Error('Exchange request not found');
  }

  let score = 0;

  const userAnswers = await Promise.all(
    answers.map(async (ans) => {
      const question = await Question.findById(ans.questionId);
      if (!question) return null;

      const isCorrect = question.correctAnswer === ans.answer;
      if (isCorrect) score++;

      return {
        questionId: question._id,
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation, // ✅ include explanation
        userAnswer: ans.answer,
        isCorrect,
      };
      console.log( question.explanation) 
    })
  );

  // Remove nulls in case any question was not found
  const filteredAnswers = userAnswers.filter(Boolean);

  // Update exchangeRequest
  exchangeRequest.userAnswers = filteredAnswers;
  exchangeRequest.score = score;

  // Set quiz status
  const pass = score >= 15;
  if (req.user._id.equals(exchangeRequest.receiver)) {
    exchangeRequest.receiverQuizStatus = pass ? 'Passed' : 'Failed';
  } else if (req.user._id.equals(exchangeRequest.sender)) {
    exchangeRequest.senderQuizStatus = pass ? 'Passed' : 'Failed';
  }

  await exchangeRequest.save();

  res.status(200).json({
    message: 'Answers submitted',
    score,
  });
});


export const getQuizResult = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await Exch
  angeRequest.findById(requestId)
    .populate('senderSkill')
    .populate('receiverSkill');

  if (!request) return res.status(404).json({ message: 'Request not found' });

  // Only the receiver can view their own quiz result
  if (request.receiver.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (!request.userAnswers || request.userAnswers.length === 0) {
    return res.status(400).json({ message: 'Quiz not attempted yet' });
  }
  const questionIds = request.userAnswers.map(a => a.questionId); 
  const questions = await Question.find({ _id: { $in: questionIds } });

  const result = request.userAnswers.map(a => {
    const q = questions.find(q => q._id.toString() === a.question.toString());
    return {
    questionId: a.questionId,
    questionText: q?.questionText || 'Question deleted',
    correctAnswer: q?.correctAnswer || '',
    selectedAnswer: a.answer, // this should match what you store during submission
    isCorrect: a.isCorrect,
    explanation: q?.explanation || 'No explanation provided'
  };
  });

  res.status(200).json({
    score: request.score,
    status: request.receiverQuizStatus,
    userAnswers: result,
  });
});

// Get all passed quiz data for dashboard
export const getPassedSkillsForUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const passedRequests = await ExchangeRequest.find({
    $or: [
      { sender: userId, senderQuizStatus: 'Passed' },
      { receiver: userId, receiverQuizStatus: 'Passed' }
    ]
  })
    .populate('sender', 'name')
    .populate('receiver', 'name')
    .populate('senderSkill', 'name')
    .populate('receiverSkill', 'name')
    .sort({ updatedAt: -1 });

  const data = passedRequests.map(req => {
    const isSender = req.sender._id.toString() === userId.toString();

    return {
      skillName: isSender ? req.receiverSkill.name : req.senderSkill.name,
      learnedFrom: isSender ? req.receiver.name : req.sender.name,
      date: req.updatedAt,
      score: req.score
    };
  });

  res.json(data);
});
