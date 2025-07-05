
import jwt from 'jsonwebtoken';

export const generateToken = (user_Id, role) => {
    return jwt.sign({ id: user_Id, role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};
