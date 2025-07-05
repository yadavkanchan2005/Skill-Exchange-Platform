import mongoose from 'mongoose';

const exchangeRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderSkill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    receiverSkill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
        default: 'Pending'
    },
    message: {
        type: String,
        default: ''
    }

,
  
userAnswers: [
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    questionText: String,
    options: [String],
    correctAnswer: String,
    userAnswer: String,
    isCorrect: Boolean
  }
],

  score: {
    type: Number,
    default: 0
  },

  
  receiverQuizStatus: { type: String, enum: ['NotAttempted', 'Failed', 'Passed'], default: 'NotAttempted' },
  senderQuizStatus: { type: String, enum: ['NotAttempted', 'Failed', 'Passed'], default: 'NotAttempted' }
}, { timestamps: true });


export default mongoose.model('ExchangeRequest', exchangeRequestSchema);
