
import ChatMessage from '../models/ChatMessage.js';
import ExchangeRequest from '../models/ExchangeRequest.js';
import asyncHandler from 'express-async-handler';
import { initSocket, getIO } from '../socket/socketMiddleware.js';


// 1. GET CHAT MESSAGES
export const getChatMessages = asyncHandler(async (req, res) => {
  const messages = await ChatMessage.find({ exchangeRequest: req.params.requestId })
    .sort({ createdAt: 1 })
    .populate('sender', '_id name profilePicture'); 
  res.json(messages);
});

// 2. SEND CHAT MESSAGESS
export const sendChatMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { requestId } = req.params;

  const exchangeRequest = await ExchangeRequest.findById(requestId);
  const validStatuses = ['accepted', 'completed'];

  if (!exchangeRequest || !validStatuses.includes(exchangeRequest.status.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid or unauthorized exchange request' });
  }

  const senderId = req.user._id.toString();
  const recipientId = exchangeRequest.sender.toString() === senderId
    ? exchangeRequest.receiver.toString()
    : exchangeRequest.sender.toString();

  let file = null;
  let fileType = null;

  if (req.file) {
    file = req.file.filename;
    const mimeType = req.file.mimetype;
    fileType = mimeType.startsWith('image/') ? 'image' : 'pdf';
  }
  const message = await ChatMessage.create({
    exchangeRequest: requestId,
    sender: senderId,
    recipient: recipientId,
    text,
    file,
    fileType
    
  });

  const populatedMessage = await ChatMessage.findById(message._id).populate('sender', '_id name profilePicture');

  const io = initSocket();
  io.to(recipientId).emit('newMessage', populatedMessage); 

  res.status(201).json(populatedMessage);
  
});


// 3. MARK MESSAGES AS READ
export const markMessagesAsRead = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const userId = req.user._id;

     await ChatMessage.updateMany(
    { exchangeRequest: requestId, recipient: userId, seen: false },
    { $set: { seen: true } }
  );

    const io = getIO();
    io.to(userId.toString()).emit('messagesRead', { requestId });

    res.status(200).json({ message: 'Messages marked as read' });
});

// 4. GET ACCEPTED CHAT THREADS + UNSEEN COUNT
export const getAcceptedExchangeChats = asyncHandler(async (req, res) => {
    const userId = req.user._id.toString();

    const acceptedRequests = await ExchangeRequest.find({
        status: { $in: ['Accepted', 'Completed'] },
        $or: [{ sender: userId }, { receiver: userId }]
    })
        .populate('sender', 'name email profilePicture')
        .populate('receiver', 'name email profilePicture')
        .sort({ updatedAt: -1 });

    const uniqueUsersMap = new Map();

    for (const request of acceptedRequests) {
        const otherUser = request.sender._id.toString() === userId ? request.receiver : request.sender;
        const key = otherUser._id.toString();

        const unseenCount = await ChatMessage.countDocuments({
            exchangeRequest: request._id,
            recipient: userId,
            seen: false
            
        });

        if (!uniqueUsersMap.has(key)) {
            uniqueUsersMap.set(key, {
                _id: request._id,
                status: request.status, 
                otherUser: {
                    _id: otherUser._id,
                    name: otherUser.name,
                    email: otherUser.email,
                    profilePicture: otherUser.profilePicture
                },
                unseenCount,
                createdAt: request.createdAt
            });
        }
    }

    const threads = Array.from(uniqueUsersMap.values());
    res.json(threads);
});


