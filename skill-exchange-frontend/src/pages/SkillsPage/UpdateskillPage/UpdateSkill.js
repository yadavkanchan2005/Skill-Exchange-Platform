import React, { useState, useEffect } from 'react';
import { getMySkills, updateSkill, getSkillById } from '../../../api/auth';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateSkill.css';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateSkill = () => {
  const [skills, setSkills] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState({
    name: '',
    category: '',
    about: '',
    level: '',
  });

  const [have, setHave] = useState('');
  const [want, setWant] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchSkillById(id);
      setSelectedId(id);
    } else {
      fetchSkills();
    }
  }, [id]);

  const fetchSkills = async () => {
    try {
      const res = await getMySkills();
      setSkills(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load skills.');
    }
  };

  const fetchSkillById = async (skillId) => {
    try {
      const res = await getSkillById(skillId);
      const description = res.data.description || '';
      const haveMatch = description.match(/I have:\s*(.*)/);
      const wantMatch = description.match(/I want to learn:\s*(.*)/);

      setHave(haveMatch ? haveMatch[1] : '');
      setWant(wantMatch ? wantMatch[1] : '');

      setForm({
        name: res.data.name || '',
        category: res.data.category || '',
        about: res.data.about || '',
        level: res.data.level || '',
      });
    } catch (err) {
      console.error(err);
      toast.error('Error fetching skill details.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const trimmedHave = have.trim();
    const trimmedWant = want.trim();

    if (!trimmedHave || !trimmedWant) {
      toast.error('Please enter both your skill and what you want to learn.');
      return;
    }

    const finalDescription = `I have: ${trimmedHave}\nI want to learn: ${trimmedWant}`;

    try {
      await updateSkill(selectedId, {
        ...form,
        description: finalDescription,
      });
      toast.success('Skill updated successfully!');
      setTimeout(() => navigate('/my-skill'), 2000);
    } catch (err) {
      console.error(err);
      toast.error('Update failed!');
    }
  };

  return (
    <div className="update-skill-container">
      <form className="update-skill-card" onSubmit={handleUpdate}>
        <h3 className="form-title">Update Skill</h3>

        {!id && (
          <div className="form-group mb-3">
            <label className="mb-2">Select a Skill</label>
            <select
              className="form-control"
              value={selectedId}
              onChange={(e) => {
                const selected = e.target.value;
                setSelectedId(selected);
                fetchSkillById(selected);
              }}
            >
              <option value="">-- Choose Skill --</option>
              {skills.map((skill) => (
                <option key={skill._id} value={skill._id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group mb-3">
          <label className="mb-2">Skill Name</label>
          <input
            type="text"
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter skill name"
            required
          />
        </div>

        <div className="form-group mb-3">
          <label className="mb-2">Category</label>
          <input
            type="text"
            className="form-control"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Enter category"
            required
          />
        </div>

        <div className="form-group mb-3">
          <label className="mb-2">What skill do you HAVE?</label>
          <input
            type="text"
            className="form-control"
            value={have}
            onChange={(e) => setHave(e.target.value)}
            placeholder="e.g., JavaScript"
            required
          />
        </div>

        <div className="form-group mb-3">
          <label className="mb-2">What do you want to LEARN?</label>
          <input
            type="text"
            className="form-control"
            value={want}
            onChange={(e) => setWant(e.target.value)}
            placeholder="e.g., Python"
            required
          />
        </div>

        <div className="form-group mb-3">
          <label className="mb-2">About this Skill</label>
          <textarea
            className="form-control"
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            placeholder="Write more about your experience or this skill..."
            rows={3}
          ></textarea>
        </div>

        <div className="form-group mb-4">
          <label className="mb-2">Skill Level</label>
          <select
            className="form-control"
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
            required
          >
            <option value="">-- Select Level --</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="button-group">
          <button
            type="submit"
            className="btn-save"
            disabled={!selectedId && !id}
          >
            <i className="bi bi-check-circle me-2"></i> Update Skill
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate('/my-skill')}
          >
            Cancel
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default UpdateSkill;
