
import Skill from '../models/skill.model.js';
import Question from '../models/Question.js';
import asyncHandler from 'express-async-handler';

export const createSkill = async (req, res) => {
    try {
        const { name, category, description, level, about, } = req.body;

        if (!name || !category) {
            return res.status(400).json({ message: 'Name and category are required' });
        }

      
        const existingSkill = await Skill.findOne({ name: name.toLowerCase(), user: req.user.id });
        if (existingSkill) {
            return res.status(409).json({ message: 'Skill already exists for this user' });
        }

        const skill = new Skill({
            name: name.toLowerCase(),
            category,
            description: description || '',
            about,
            level: level || 'Beginner',
            user: req.user.id
        });

        await skill.save();
        res.status(201).json({ message: 'Skill created successfully', skill });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getMySkills = async (req, res) => {
    try {
        const skills = await Skill.find({ user: req.user.id }).sort({ name: 1 });
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSkill = async (req, res) => {
    try {
        const { name, category, description, level, about, } = req.body;
        const { id } = req.params;

        const skill = await Skill.findById(id);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        if (name) skill.name = name.toLowerCase();
        if (category) skill.category = category;
        if (description !== undefined) skill.description = description;
        if (level) skill.level = level;
        if (about) skill.about = about;


        await skill.save();
        res.status(200).json({ message: 'Skill updated successfully', skill });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const skill = await Skill.findById(id);

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        await skill.deleteOne();
        res.status(200).json({ message: 'Skill deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find().populate('user', 'name email').sort({ name: 1 });
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSkillById = async (req, res) => {
    try {
        const { id } = req.params;
        const skill = await Skill.findById(id);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.status(200).json(skill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getExploreSkills = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;

        const skills = await Skill.find({ user: { $ne: loggedInUserId } })
            .populate('user', 'name email profilePicture')  // Adjust fields as needed
            .sort({ name: 1 });

        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const addQuestionsToSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { questions } = req.body;

        if (!id || !Array.isArray(questions)) {
            return res.status(400).json({ message: 'Skill ID and questions array are required' });
        }
        const questionsToInsert = questions.map(q => ({
            skill: id,
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
             explanation: q.explanation || '',

        }));

        const savedQuestions = await Question.insertMany(questionsToInsert);

        res.status(201).json({ message: 'Questions added successfully', questions: savedQuestions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getQuestionsBySkill = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const skill = await Skill.findById(id);
  if (!skill) return res.status(404).json({ message: 'Skill not found' });

  const questions = await Question.find({
    skill: skill._id,
    owner: skill.owner, 
  }).select('-correctAnswer');

  res.status(200).json(questions);
});



// Update a single question by its _id
export const updateQuestionById = async (req, res) => {
    try {
        const { id } = req.params; // Question _id
        const { questionText, options, correctAnswer,explanation } = req.body;

        const updated = await Question.findByIdAndUpdate(
            id,
            { questionText, options, correctAnswer ,explanation},
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Delete a single question by its _id
export const deleteQuestionById = async (req, res) => {
    try {
        const { id } = req.params; // Question _id

        const deleted = await Question.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




