import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
  },
    owner: 
    { type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' },

  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: String,
    required: true,
  },

  explanation: {
  type: String,
  default: '',
},
}, {
  timestamps: true,
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
