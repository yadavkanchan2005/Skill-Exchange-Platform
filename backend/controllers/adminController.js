import User from '../models/User.js';
import Skill from '../models/Skill.js';
import ExchangeRequest from '../models/ExchangeRequest.js';

//  Get All Users
export const listAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};

// Delete a User by ID
export const removeUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};



// Toggle User Active Status
export const toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({ message: `User is now ${user.isActive ? 'active' : 'inactive'}` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to toggle user status', error: error.message });
    }
};



// Get All Skills
export const listAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch skills', error: error.message });
    }
};



//  Delete a Skill by ID
export const removeSkill = async (req, res) => {
    try {
        await Skill.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Skill deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete skill', error: error.message });
    }
};



//  Get All Exchange Requests
export const listAllExchangeRequests = async (req, res) => {
    try {
        const exchanges = await ExchangeRequest.find()
            .populate('fromUser toUser skillOffered skillRequested');
        res.status(200).json(exchanges);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch exchange requests', error: error.message });
    }
};



//  Delete an Exchange Request by ID
export const removeExchangeRequest = async (req, res) => {
    try {
        await ExchangeRequest.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Exchange request deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete exchange request', error: error.message });
    }
};
