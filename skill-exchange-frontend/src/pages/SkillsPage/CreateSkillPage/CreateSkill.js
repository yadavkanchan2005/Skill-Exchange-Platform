import React, { useState } from 'react';
import { createSkill } from '../../../api/auth';
import './CreateSkill.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateSkill = ({ onCreated, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    level: 'Beginner',
    about: '',
  });

  const [wantToLearn, setWantToLearn] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedLearn = wantToLearn.trim();

    if (!trimmedName || !trimmedLearn) {
      toast.error('Please enter both your skill and what you want to learn.');
      return;
    }

    const description = `I have: ${trimmedName}\nI want to learn: ${trimmedLearn}`;

    try {
      await createSkill({
        ...form,
        name: trimmedName,
        description,
        about: form.about,
      });

      toast.success('Skill created successfully!');
      onCreated();
    } catch (err) {
      console.error('Create Skill Error:', err);
      toast.error(err.response?.data?.message || 'Error while creating skill');
    }
  };

  return (
    <div className="create-skill-overlay">
      <div className="create-skill-container glassmorphism">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <form onSubmit={handleSubmit}>
          <h2>Create New Skill</h2>

          <label>What skill do you HAVE?</label>
          <input
            type="text"
            placeholder="e.g., JavaScript"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <label>Skill Category</label>
          <input
            type="text"
            placeholder="e.g., Programming"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />

          <label>What do you want to LEARN?</label>
          <input
            type="text"
            placeholder="e.g., Python"
            value={wantToLearn}
            onChange={(e) => setWantToLearn(e.target.value)}
            required
          />


          <label>About this Skill</label>
          <textarea
            placeholder="Tell us more about your experience or this skill..."
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            rows={4}
          />

          <label>Skill Level</label>
          <select
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <div className="btn-group">
            <button type="submit" className="btn-save">
              Create Skill
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </div>
    </div>
  );
};

export default CreateSkill;
