
import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    exchangeRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExchangeRequest',
        required: true
    },
    sender: {
        type:String,
        ref: 'User',
        required: true
    },
    recipient: {
        type: String,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
       
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    seen: {
        type: Boolean,
        default: false
    },
    seenAt: {
        type: Date
    },
      file: {
    type: String 
  },
  fileType: {
    type: String 
  },
}, { timestamps: true }); 

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;
