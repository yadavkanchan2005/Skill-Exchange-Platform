
import User from '../models/user.model.js';
import Skill from '../models/skill.model.js';
import ExchangeRequest from '../models/ExchangeRequest.js';


// Create user profile
export const createProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.gender || user.dateOfBirth || user.education || user.languages?.length || user.experienceLevel || user.skills?.length || user.profilePicture?.length) {
            return res.status(400).json({ message: 'Profile already exists. Please use update instead.' });
        }

        const {
            name,
            gender,
            dateOfBirth,
            education,
            languages,
            experienceLevel,
            skills,
            profilePicture
        } = req.body;

        if (name) user.name = name;
        if (gender) user.gender = gender;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (education) user.education = education;
        if (languages) user.languages = languages;
        if (experienceLevel) user.experienceLevel = experienceLevel;
        if (skills) user.skills = skills;
        if (profilePicture) user.profilePicture = profilePicture;

        await user.save();
        res.status(201).json({ message: 'Profile created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Upload Profile Image
export const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        user.profilePicture = req.file.filename;
        await user.save();

        res.status(200).json({ message: 'Profile image uploaded successfully', imageUrl: req.file.filename });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('skills');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            education: user.education,
            languages: user.languages,
            experienceLevel: user.experienceLevel,
            profileLevel: user.profileLevel, 
            badges: user.badges,               
            skills: user.skills.map(skill => skill.name),
            profilePicture: user.profilePicture,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const {
            name,
            gender,
            dateOfBirth,
            education,
            languages,
            experienceLevel,
            skills,
        } = req.body;

        // Process Skills
        let skillIds = [];
        if (skills && Array.isArray(skills)) {
            skillIds = await Promise.all(
                skills.map(async (skillName) => {
                    const name = skillName.toLowerCase().trim();
                    let existing = await Skill.findOne({ name });
                    if (!existing) {
                        existing = await Skill.create({ name, user: user._id });
                    }
                    return existing._id;
                })
            );
            user.skills = skillIds;
        }

        if (name) user.name = name;
        if (gender) user.gender = gender;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (education) user.education = education;
        if (languages) user.languages = languages;
        if (experienceLevel) user.experienceLevel = experienceLevel;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete user profile
export const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

















export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Count number of times user passed as sender
    const passedAsSender = await ExchangeRequest.countDocuments({
      sender: userId,
      senderQuizStatus: "Passed"
    });

    // Count number of times user passed as receiver
    const passedAsReceiver = await ExchangeRequest.countDocuments({
      receiver: userId,
      receiverQuizStatus: "Passed"
    });


    const completedCount = passedAsSender + passedAsReceiver;

    // Optional: Calculate badges and experience level
    const badges = [];
    if (completedCount >= 1) badges.push("Quiz Finisher");
    if (completedCount >= 5) badges.push("Skill Star");
    if (completedCount >= 10) badges.push("Master Exchanger");

    const experienceLevel =
      completedCount >= 10
        ? "Advanced"
        : completedCount >= 5
        ? "Intermediate"
        : "Beginner";

    res.status(200).json({
      completedCount,
      experienceLevel,
      badges,
    });
  } catch (error) {
    console.error("Error getting user progress:", error);
    res.status(500).json({ message: "Error getting user progress" });
  }
};
