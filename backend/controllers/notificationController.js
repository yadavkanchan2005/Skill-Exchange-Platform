
import Notification from '../models/NotificationModel.js';
import { getIO } from '../socket/socketMiddleware.js';


export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .populate('sender', 'name')
            .populate('requestId');

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        if (notification.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create and send a new notification + emit through socket
export const createNotification = async (req, res) => {
    try {
        const { recipientId, message, requestId } = req.body;

        const newNotification = new Notification({
            recipient: recipientId,
            sender: req.user.id,
            message,
            requestId,
        });

        await newNotification.save();
        const io = getIO();
        io.to(recipientId).emit('new-notification', {
            _id: newNotification._id,
            message,
            sender: req.user.name,
            requestId,
            time: new Date(),
        });

        res.status(201).json({ message: 'Notification sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
