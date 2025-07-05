
import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        default: ''
    },
    about: {
        type: String,

    },
    category: {
        type: String,
        default: ''
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }]

}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
