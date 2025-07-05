
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },

    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
    }],

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },

    dateOfBirth: {
        type: Date,
        default: null
    },

    education: {
        type: String,
        default: ''
    },

    languages: [{
        type: String
    }],

    experienceLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Expert'],
        default: 'Beginner'
    },

    profilePicture: {
        type: String,
        default: '/default-avatar.png'
    },

    resetPasswordOtp: {
        type: Number,
    },

    resetPasswordExpire: {
        type: Date,
    },
    isGoogleUser: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// password hash before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    if (this.password && this.password.startsWith('$2b$')) {
        return next();
    }

    const bcrypt = await import('bcryptjs');
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);
export default User;
