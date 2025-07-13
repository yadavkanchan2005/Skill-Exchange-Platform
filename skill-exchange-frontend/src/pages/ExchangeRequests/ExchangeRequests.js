import React, { useEffect, useState } from 'react';
import {
  getMyExchangeRequests,
  getCurrentUser,
} from '../../api/auth';
import ExchangeRequestCard from '../../components/ExchangeRequestCard/ExchangeRequestCard';
import './ExchangeRequests.css';

const ExchangeRequests = () => {
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [filter, setFilter] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);

  const loadRequests = async () => {
    const res = await getMyExchangeRequests();
    setRequests(res.data);
  };

  const loadCurrentUser = async () => {
    const res = await getCurrentUser();
    setCurrentUser(res.data);
  };

  const handleComplete = async (id) => {
    // await completeExchangeRequest(id);
    loadRequests();
  };

  useEffect(() => {
    loadRequests();
    loadCurrentUser();
  }, []);

  if (!currentUser) return <p>Loading...</p>;

  const showReceived = filter === 'received' || filter === 'all';
  const showSent = filter === 'sent' || filter === 'all';

  return (
    <div className="exchange-wrapper">
      <header className="exchange-header">
        <h1>Exchange Requests</h1>
        <div className="filter-tabs">

          <button className="back-button" onClick={() => window.history.back()}>&larr; Back</button>

          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'received' ? 'active' : ''} onClick={() => setFilter('received')}>Received</button>
          <button className={filter === 'sent' ? 'active' : ''} onClick={() => setFilter('sent')}>Sent</button>
        </div>
      </header>

      <div className="exchange-grid">
        {showReceived && (
          <div className="request-section">
            <h2>Received Requests</h2>
            {requests.received.length === 0 && <p>No received requests.</p>}
            {requests.received.map((req) => (
              <ExchangeRequestCard
                key={req._id}
                request={req}
                type="received"
                onComplete={handleComplete}
                currentUserId={currentUser._id}
              />
            ))}
          </div>
        )}

        {showSent && (
          <div className="request-section">
            <h2>Sent Requests</h2>
            {requests.sent.length === 0 && <p>No sent requests.</p>}
            {requests.sent.map((req) => (
              <ExchangeRequestCard
                key={req._id}
                request={req}
                type="sent"
                onComplete={handleComplete}
                currentUserId={currentUser._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangeRequests;
