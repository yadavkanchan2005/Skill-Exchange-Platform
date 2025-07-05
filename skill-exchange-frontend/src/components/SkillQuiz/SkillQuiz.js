import React, { useEffect, useState } from 'react';
import { getQuestionsBySkill, submitAnswers } from '../../api/auth';
import Swal from 'sweetalert2';
import html2pdf from 'html2pdf.js';
import './SkillQuiz.css';

const SkillQuiz = ({ requestId, skillId, onComplete, alreadyAttempted, previousAnswers }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [viewOnly, setViewOnly] = useState(alreadyAttempted);

  useEffect(() => {
    const fetch = async () => {
      const res = await getQuestionsBySkill(skillId);
      setQuestions(res.data);
      console.log('Fetched questions:', res.data);

      if (alreadyAttempted && previousAnswers) {
        console.log('Fetched previousAnswers:', previousAnswers);
        setScore(previousAnswers.score);
        const restored = {};
        previousAnswers.userAnswers.forEach(ans => {
          restored[ans.questionId.toString()] = ans.selectedAnswer || ans.userAnswer;
        });
        setAnswers(restored);
      }
    };
    if (skillId) fetch();
  }, [skillId, alreadyAttempted, previousAnswers]);

  const handleAnswer = (qId, ans) => {
    if (!viewOnly) {
      setAnswers(prev => ({ ...prev, [qId]: ans }));
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await submitAnswers({
        requestId,
        answers: questions.map(q => ({
          questionId: q._id,
          answer: answers[q._id] || ''
        }))
      });
      setScore(res.score);
      Swal.fire({
        title: res.score >= 15 ? '🎉 Passed!' : 'Submitted!',
        html: `You scored <b>${res.score}</b>/${questions.length}`,
        icon: res.score >= 15 ? 'success' : 'info',
      });
      if (onComplete) onComplete();
      setViewOnly(true);
    } catch (err) {
      Swal.fire('Oops!', err?.response?.data?.message || 'Submit failed', 'error');
    }
  };

  const exportPDF = () => {
    const element = document.getElementById('quiz-result');
    html2pdf().from(element).set({
      margin: 0.5,
      filename: 'quiz-result.pdf',
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'avoid-all'], before: '.page-break' }
    }).save();
  };

  const allAnswered = questions.length && Object.keys(answers).length === questions.length;

  return (
    <div className="quiz-container">
      <h2 className="text-center my-3"> Skill Quiz</h2>

      <div id="quiz-result">
        {questions.map((q, idx) => {
          const matchingAnswer = previousAnswers?.userAnswers?.find(
            a => a.questionId?.toString() === q._id?.toString()
          );

          const selected = viewOnly
            ? matchingAnswer?.selectedAnswer || matchingAnswer?.userAnswer
            : answers[q._id];

          const correct = matchingAnswer?.correctAnswer;
          const isCorrect = matchingAnswer?.isCorrect;
          const explanation = q.explanation;

          return (
            <React.Fragment key={q._id}>
              <div className="mb-3 p-3 border rounded question-card">
                <strong>Q{idx + 1}:</strong> {q.questionText}

                <div className="mt-2">
                  {q.options.map(opt => (
                    <label
                      key={opt}
                      className={`d-block ${viewOnly &&
                        (opt === correct
                          ? 'text-success'
                          : opt === selected && opt !== correct
                            ? 'text-danger'
                            : '')
                        }`}
                    >
                      <input
                        type="radio"
                        name={q._id}
                        value={opt}
                        checked={selected === opt}
                        disabled={viewOnly}
                        onChange={() => handleAnswer(q._id, opt)}
                      />{' '}
                      {opt}
                      {viewOnly && opt === correct && ' ✅'}
                      {viewOnly && opt === selected && opt !== correct && ' ❌'}
                    </label>
                  ))}
                </div>

                {viewOnly && (
                  <div className="mt-2">
                    <small>
                      Your answer: <b>{selected || '❌ Not Answered'}</b> || Correct: <b>{correct}</b> ||{' '}
                      {isCorrect === true ? '✅ Correct' : isCorrect === false ? '❌ Wrong' : ''}
                    </small>
                    <div className="text-muted mt-1">
                      <i>{q.explanation ? `Explanation: ${q.explanation}` : 'No explanation provided.'}</i>
                    </div>
                  </div>
                )}
              </div>

              {/* Page break after every 4 questions */}
              {(idx + 1) % 3 === 0 && <div className="page-break"></div>}
            </React.Fragment>
          );
        })}

        {viewOnly && score !== null && (
          <div className="text-center mt-4">
            <h5>Your Score: {score} / {questions.length}</h5>
            <h6>Percentage: {(score / questions.length * 100).toFixed(2)}%</h6>
            <span className={`badge ${score >= questions.length * 0.6 ? 'bg-success' : 'bg-danger'}`}>
              {score >= questions.length * 0.6 ? ' Pass' : ' Fail'}
            </span>
          </div>
        )}
      </div>

      {!viewOnly && (
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!allAnswered}>
            Submit Quiz
          </button>
        </div>
      )}

      {viewOnly && (
        <div className="text-center mt-3">
          <button className="btn btn-outline-dark" onClick={exportPDF}>
            Export Result as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillQuiz;
