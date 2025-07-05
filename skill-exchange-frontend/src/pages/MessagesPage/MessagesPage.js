import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../../Utils/axios';
import { sendChatMessage, markMessagesAsRead, getAcceptedChats } from '../../api/auth';
import moment from 'moment';
import './MessagesPage.css';
import { FaPaperclip, FaCheckDouble, FaPaperPlane, FaSearch } from 'react-icons/fa';

const MessagesPage = ({ currentUserId }) => {
  const [chatThreads, setChatThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [typing, setTyping] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const fallbackUserId = storedUser?._id || storedUser?.id || null;
  const effectiveUserId = currentUserId || fallbackUserId;

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await getAcceptedChats();
        setChatThreads(res.data);
        const savedThreadId = localStorage.getItem('selectedThreadId');
        if (savedThreadId) {
          const thread = res.data.find(t => t._id === savedThreadId);
          if (thread) setSelectedThread(thread);
        }
      } catch (error) {
        console.error('Failed to fetch chat threads', error);
      }
    };
    fetchThreads();
  }, []);

  useEffect(() => {
    if (effectiveUserId && window.socket) {
      window.socket.emit('join', effectiveUserId);
    }
  }, [effectiveUserId]);

  useEffect(() => {
    if (!selectedThread) return;
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/chat/${selectedThread._id}`);
        setMessages(res.data);
        setChatThreads(prev =>
          prev.map(t => t._id === selectedThread._id ? { ...t, unseenCount: 0 } : t)
        );
        await markMessagesAsRead(selectedThread._id);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };
    fetchMessages();
    localStorage.setItem('selectedThreadId', selectedThread._id);
  }, [selectedThread]);

  useEffect(() => {
    const socket = window.socket;
    if (!socket) return;

    const handleNewMessage = (message) => {
      const threadId = message.exchangeRequest._id || message.exchangeRequest;
      const senderId = message.sender._id || message.sender;

      if (selectedThread && threadId === selectedThread._id) {
        setMessages(prev => [...prev, message]);
      } else {
        setChatThreads(prev =>
          prev.map(thread =>
            thread._id === threadId
              ? {
                ...thread,
                unseenCount: (thread.unseenCount || 0) + 1,
                lastMessage: message.text || '📎 Attachment',
                lastMessageTime: message.createdAt,
              }
              : thread
          )
        );
      }
    };

    const handleTyping = ({ threadId, userId }) => {
      if (threadId === selectedThread?._id && userId !== effectiveUserId) {
        setIsOtherTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 2000);
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('typing', handleTyping);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('typing', handleTyping);
    };
  }, [selectedThread, effectiveUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!selectedThread || !effectiveUserId || (!text.trim() && !file)) return;
    const formData = new FormData();
    formData.append('text', text);
    if (file) formData.append('file', file);

    try {
      const res = await sendChatMessage(selectedThread._id, formData);
      setMessages(prev => [...prev, res.data]);
      setText('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  const handleTyping = () => {
    if (!typing && selectedThread) {
      setTyping(true);
      window.socket.emit('typing', {
        threadId: selectedThread._id,
        userId: effectiveUserId
      });
      setTimeout(() => setTyping(false), 2000);
    }
  };

  const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach(msg => {
      const dateKey = moment(msg.createdAt).startOf('day').format('YYYY-MM-DD');
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(msg);
    });
    return grouped;
  };

  const formatDateLabel = (date) => {
    const mDate = moment(date);
    if (mDate.isSame(moment(), 'day')) return 'Today';
    if (mDate.isSame(moment().subtract(1, 'day'), 'day')) return 'Yesterday';
    if (mDate.isAfter(moment().subtract(7, 'days'))) return mDate.format('dddd');
    return mDate.format('MMM D, YYYY');
  };

  const filteredThreads = chatThreads.filter(thread =>
    thread.otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-4 messages-sidebar">
          <div className="p-3 d-flex align-items-center">
            <FaSearch className="me-2" />
            <input
              type="text"
              className="form-control"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredThreads.map(thread => (
            <div
              key={thread._id}
              className={`d-flex align-items-center p-2 rounded ${selectedThread?._id === thread._id ? 'selected-thread text-white' : ''}`}
              onClick={() => setSelectedThread(thread)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={
                  thread.otherUser?.profilePicture
                    ? `http://localhost:3000/uploads/${thread.otherUser.profilePicture}`
                    : "/default.png"
                }
                alt="Profile"
                className="profile-pic me-2"
                width="40"
                height="40"
              />
              <div className="fw-bold d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <span>{thread.otherUser?.name}</span>
                  {thread.unseenCount > 0 && (
                    <span className="badge unseen-count">{thread.unseenCount}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-8 chat-panel">
          <div className="chat-panel-header d-flex align-items-center">
            {selectedThread && (
              <>
                <img
                  src={
                    selectedThread.otherUser?.profilePicture
                      ? `http://localhost:3000/uploads/${selectedThread.otherUser.profilePicture}`
                      : "/default.png"
                  }
                  alt="Profile"
                  className="profile-pic me-2"
                />
                <h6 className="mb-0">{selectedThread.otherUser?.name}</h6>
              </>
            )}
          </div>

          <div className="chat-messages">
            {Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (
              <div key={date}>
                <div className="text-center text-muted small mb-2">
                  {formatDateLabel(date)}
                </div>
                {msgs.map((msg, idx) => {
                  const isOwnMessage =
                    typeof msg.sender === 'object'
                      ? msg.sender._id === effectiveUserId
                      : msg.sender === effectiveUserId;

                  return (
                    <div
                      key={idx}
                      className={`d-flex ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'} mb-2`}
                    >
                      <div className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}>
                        {msg.text && <div>{msg.text}</div>}
                        {msg.file && msg.fileType === 'image' && (
                          <img
                            src={`http://localhost:3000/uploads/${msg.file}`}
                            alt="attachment"
                            className="img-fluid rounded mt-1"
                          />
                        )}
                        {msg.file && msg.fileType === 'pdf' && (
                          <a
                            href={`http://localhost:3000/uploads/${msg.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="d-block mt-1 text-info text-decoration-underline"
                          >
                            View File
                          </a>
                        )}
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                            {moment(msg.createdAt).format('hh:mm A')}
                          </small>
                          {isOwnMessage && msg.seen && (
                            <FaCheckDouble size={12} className="ms-1 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            {isOtherTyping && <div className="text-muted px-3">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input d-flex align-items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
              className="d-none"
            />
            <FaPaperclip
              size={20}
              className="icon-attach"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            />
            {file && <span className="text-muted small file-name-preview">{file.name}</span>}
            <input
              type="text"
              className="form-control chat-text-input"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
            />
            <button className="btn send-btn" onClick={handleSend}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
