import React, { useEffect, useState } from 'react';
import {
  getQuestionsBySkill,
  addQuestionsToSkill,
  updateQuestionById,
  deleteQuestionById
} from '../../api/auth';
import Swal from 'sweetalert2';
import './Quetions.css';

const SkillQuestionsManager = ({ skillId, onClose, mode }) => {
  const [questions, setQuestions] = useState([]);
  const [editableQuestions, setEditableQuestions] = useState([]);
  const [newQuestions, setNewQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skillId && mode === 'view') {
      fetchQuestions();
    }
  }, [skillId, mode]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await getQuestionsBySkill(skillId);
      setQuestions(res.data);
      setEditableQuestions(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to fetch questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestions = async (e) => {
    e.preventDefault();
    try {
      await addQuestionsToSkill(skillId, { questions: newQuestions });
      setNewQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }]);
      if (mode === 'view') fetchQuestions();

      Swal.fire({
        title: '✅ Saved!',
        text: 'Questions added successfully.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to add questions', 'error');
    }
  };

  const handleUpdateQuestion = async (id, updatedQuestion) => {
    try {
      await updateQuestionById(id, updatedQuestion);
      fetchQuestions();

      Swal.fire({
        title: '✅ Updated!',
        text: 'Question updated successfully.',
        icon: 'success',
        confirmButtonColor: '#28a745',
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update question', 'error');
    }
  };

  const handleDeleteQuestion = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This question will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteQuestionById(id);
        fetchQuestions();
        Swal.fire('Deleted!', 'The question has been removed.', 'success');
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete question.', 'error');
      }
    }
  };

  const handleClose = () => {
    Swal.fire({
      title: '👏 Great work!',
      text: 'You managed the quiz well. Ready for more?',
      icon: 'info',
      confirmButtonText: 'Yes!',
    }).then(() => {
      if (onClose) onClose();
    });
  };

  return (
    <div className="container py-4 skill-question-manager">
      <h3 className="mb-4">{mode === 'add' ? 'Add New Questions' : 'Manage Questions'}</h3>

      {mode === 'view' && (
        <>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {editableQuestions.length === 0 ? (
                <p>No questions found.</p>
              ) : (
                editableQuestions.map((q, idx) => (
                  <div key={q._id} className="question-card">
                    <h6>Question {idx + 1}</h6>

                    <input
                      className="form-control mb-2"
                      value={q.questionText}
                      onChange={(e) => {
                        const updated = [...editableQuestions];
                        updated[idx].questionText = e.target.value;
                        setEditableQuestions(updated);
                      }}
                    />

                    {q.options.map((opt, oIdx) => (
                      <input
                        key={oIdx}
                        className="form-control mb-1"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...editableQuestions];
                          updated[idx].options[oIdx] = e.target.value;
                          setEditableQuestions(updated);
                        }}
                      />
                    ))}

                    <input
                      className="form-control mb-2"
                      placeholder="Correct Answer"
                      value={q.correctAnswer}
                      onChange={(e) => {
                        const updated = [...editableQuestions];
                        updated[idx].correctAnswer = e.target.value;
                        setEditableQuestions(updated);
                      }}
                    />

                    <textarea
                      className="form-control mb-2"
                      placeholder="Explanation (optional)"
                      value={q.explanation || ''}
                      onChange={(e) => {
                        const updated = [...editableQuestions];
                        updated[idx].explanation = e.target.value;
                        setEditableQuestions(updated);
                      }}
                    ></textarea>

                    <div className="text-end">
                      <button className="btn-update" onClick={() => handleUpdateQuestion(q._id, q)}>Update</button>
                      <button className="btn-delete" onClick={() => handleDeleteQuestion(q._id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          <hr />
        </>
      )}

      <form onSubmit={handleAddQuestions}>
        {newQuestions.map((q, idx) => (
          <div key={idx} className="question-card">
            <label>Question {idx + 1}</label>
            <input
              className="form-control mb-2"
              value={q.questionText}
              onChange={(e) => {
                const updated = [...newQuestions];
                updated[idx].questionText = e.target.value;
                setNewQuestions(updated);
              }}
              placeholder="Question Text"
            />
            {q.options.map((opt, oIdx) => (
              <input
                key={oIdx}
                className="form-control mb-1"
                value={opt}
                placeholder={`Option ${oIdx + 1}`}
                onChange={(e) => {
                  const updated = [...newQuestions];
                  updated[idx].options[oIdx] = e.target.value;
                  setNewQuestions(updated);
                }}
              />
            ))}
            <input
              className="form-control mb-2"
              placeholder="Correct Answer"
              value={q.correctAnswer}
              onChange={(e) => {
                const updated = [...newQuestions];
                updated[idx].correctAnswer = e.target.value;
                setNewQuestions(updated);
              }}
            />

            <textarea
              className="form-control mb-2"
              placeholder="Explanation (optional)"
              value={q.explanation || ''}
              onChange={(e) => {
                const updated = [...newQuestions];
                updated[idx].explanation = e.target.value;
                setNewQuestions(updated);
              }}
            ></textarea>
          </div>
        ))}

        <div className="d-flex flex-wrap gap-2 mt-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              setNewQuestions([
                ...newQuestions,
                { questionText: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' },
              ])
            }
          >
            Add More
          </button>
          <button type="submit" className="btn btn-success">Save New</button>
          {onClose && (
            <button type="button" className="btn btn-outline-danger ms-auto" onClick={handleClose}>
              Close
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SkillQuestionsManager;
