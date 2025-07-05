
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['exchange-request', 'exchange-accepted', 'exchange-rejected', 'message'],
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExchangeRequest',
        required: false
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
