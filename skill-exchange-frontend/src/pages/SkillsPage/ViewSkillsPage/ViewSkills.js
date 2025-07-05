import React, { useEffect, useState } from 'react';
import { getMySkills, deleteSkill } from '../../../api/auth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewSkills.css';
import SkillQuestionsManager from '../../../components/SkillQuestions/SkillQuetions';

const ViewSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await getMySkills();
      setSkills(res.data);
    } catch (err) {
      Swal.fire('Error!', 'Failed to fetch skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the skill!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteSkill(id);
        await fetchSkills();
        Swal.fire('Deleted!', 'Skill has been deleted.', 'success');
      } catch (err) {
        Swal.fire('Error!', 'Failed to delete skill.', 'error');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/my-skill/update/${id}`);
  };

  return (
    <div className="viewskills-main">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row g-4">
          {skills.map((skill) => {
            const lines = skill.description ? skill.description.split('\n') : [];

            return (
              <div className="col-12" key={skill._id}>
                <div className="viewskills-card shadow-sm h-100">
                  <div className="viewskills-card-body card-body">
                    <h5 className="viewskills-card-title">{skill.name}</h5>
                    <p><strong>Category:</strong> {skill.category}</p>
                    {lines.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                    <p><strong>Level:</strong> {skill.level}</p>
                    <p><strong>About:</strong> {skill.about}</p>

                    <div className="viewskills-buttons">
                      <button
                        onClick={() => handleEdit(skill._id)}
                        className="viewskills-btn viewskills-btn-edit"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="viewskills-btn viewskills-btn-delete"
                      >
                        Delete
                      </button>

                      <button
                        className="viewskills-btn viewskills-btn-view"
                        onClick={() => {
                          setSelectedSkillId(
                            selectedSkillId === skill._id && !isAdding ? null : skill._id
                          );
                          setIsAdding(false);
                        }}
                      >
                        View Questions
                      </button>

                      <button
                        className="viewskills-btn viewskills-btn-add"
                        onClick={() => {
                          setSelectedSkillId(
                            selectedSkillId === skill._id && isAdding ? null : skill._id
                          );
                          setIsAdding(true);
                        }}
                      >
                        Add Questions
                      </button>
                    </div>
                  </div>

                  {selectedSkillId === skill._id && (
                    <div className="viewskills-border-top p-3 viewskills-bg-light">
                      <SkillQuestionsManager
                        skillId={skill._id}
                        mode={isAdding ? 'add' : 'view'}
                        onClose={() => {
                          setSelectedSkillId(null);
                          setIsAdding(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default ViewSkills;
