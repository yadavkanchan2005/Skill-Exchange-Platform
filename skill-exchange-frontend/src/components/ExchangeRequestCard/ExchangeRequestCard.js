

import React, { useState } from 'react';
import SkillQuiz from '../SkillQuiz/SkillQuiz';

const ExchangeRequestCard = ({ request, type, onComplete }) => {
  const [showQuiz, setShowQuiz] = useState(false);

  const sender = request.sender?.name || 'You';
  const receiver = request.receiver?.name || 'You';

  const isReceiver = type === 'received';
  const userAnswers = request.userAnswers || [];
  const alreadyAttempted = userAnswers.length > 0;

  const handleCompleteClick = () => setShowQuiz(true);
  const handleQuizComplete = () => {
    setShowQuiz(false);
    if (onComplete) onComplete(request._id);
  };

  return (
    <div className="card mb-4 shadow-sm exchange-card">
      <div className="card-body">
        <h5 className="card-title fw-bold text-primary mb-3">
          {type === 'sent' ? `To: ${receiver}` : `From: ${sender}`}
        </h5>

        <p className="card-text"><strong>Your Skill:</strong> {request.senderSkill?.name}</p>
        <p className="card-text"><strong>Their Skill:</strong> {request.receiverSkill?.name}</p>
        <p className="card-text">
          <strong>Status:</strong>{' '}
          <span className={`badge bg-${getBadgeColor(request.status)}`}>
            {request.status}
          </span>
        </p>

        <div className="mt-3 d-flex gap-2">
          {request.status === 'Accepted' && isReceiver && (
            <button className="btn btn-primary" onClick={handleCompleteClick}>
              {alreadyAttempted ? 'View Result' : 'Take Quiz to Complete'}
            </button>
          )}
        </div>
      </div>

      {showQuiz && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Skill Quiz</h5>
                <button type="button" className="btn-close" onClick={() => setShowQuiz(false)}></button>
              </div>
              <div className="modal-body">
                <SkillQuiz
                  requestId={request._id}
                  skillId={isReceiver ? request.senderSkill?._id : request.receiverSkill?._id}
                  onComplete={handleQuizComplete}
                  alreadyAttempted={alreadyAttempted}
                  previousAnswers={{ userAnswers: userAnswers, score: request.score }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getBadgeColor = (status) => {
  switch (status) {
    case 'Pending': return 'warning';
    case 'Accepted': return 'success';
    case 'Rejected': return 'danger';
    case 'Completed': return 'info';
    default: return 'secondary';
  }
};

export default ExchangeRequestCard;
