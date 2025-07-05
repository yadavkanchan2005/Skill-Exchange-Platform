
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '').trim();

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded JWT:', decoded);
        const user = await User.findById(decoded._id || decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(' JWT Error:', error.message);
        return res.status(401).json({ message: "Token is not valid" });
    }
};

export default authMiddleware;
