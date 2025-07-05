
import React, { useState } from 'react';
import ViewSkills from '../ViewSkillsPage/ViewSkills';
import CreateSkill from '../CreateSkillPage/CreateSkill';
import './MySkill.css';
import { useNavigate } from 'react-router-dom';

const MySkills = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="myskills-wrapper">
            <div className="myskills-header">
                <h2 className="myskills-title">My Skills</h2>

                <div className="myskills-actions">
                    <button className="btn-back" onClick={() => navigate('/dashboard')}>
                        ← Back
                    </button>

                    <button className="btn-add" onClick={() => setShowCreateForm(!showCreateForm)}>
                        {showCreateForm ? 'Cancel' : '➕ Add New Skill'}
                    </button>
                </div>
            </div>

            {showCreateForm ? (
                <CreateSkill
                    onCreated={() => setShowCreateForm(false)}
                    onClose={() => setShowCreateForm(false)}
                />
            ) : (
                <ViewSkills />
            )}
        </div>
    );
};

export default MySkills;

