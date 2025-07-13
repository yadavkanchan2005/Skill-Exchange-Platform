#  Skill Exchange Platform

The **Skill Exchange Platform** 
The Skill Exchange Platform is a full-stack MERN application designed for peer-to-peer learning. 
Users can sign up using Google, list their skills, request to learn other users' skills, 
attempt quizzes, and chat in real-time using Socket.IO.

This system promotes collaborative learning by connecting users who want to learn 
and teach skills — all without any monetary transactions.




# Project Type
## Desktop-Based Application

> This is a **desktop-first** web application. It is best viewed in a browser on a laptop or PC. Mobile responsiveness is included but optimized for larger screens.

 # 2. Features

-  Skill Exchange Requests  
- Real-Time Chat using Socket.IO  
-  Google Login with Firebase Auth  
-  Skill Quiz Module with One-Time Attempt  
-  Smart Notifications for Exchange Requests & Messages  
-  File Upload Support in Chat (image, video)  
-  Responsive, Modular UI  
-  JWT-based Secure Authentication


3. Technology Stack

### Frontend
- React.js
- Bootstrap (for responsive UI)
- HTML, CSS, JavaScript

### 🔧 Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose (for schema and relations)

###  Authentication
- Firebase Authentication (Google Login)
- JSON Web Token (JWT)

### Real-Time
- Socket.IO (live messaging, typing indicators)

### Others
- SweetAlert2
- html2pdf.js (PDF export for quiz result)


4. Features
- Google Login with Firebase
- Skill listing and filtering
- Send/accept exchange requests
- Real-time chat with typing indicators
- Skill-based quiz with scoring
- One-time quiz attempt with result view
- Notifications for requests and responses
- Responsive UI with isolated scroll areas
- User profile with image support


 5. User Journey
1. User signs up/login via Google.
2. Adds skills they can teach.
3. Browses skills others offer.
4. Sends an exchange request.
5. Upon acceptance, chat is enabled.
6. User attempts a quiz (once).
7. After the session, both users can mark the session as complete.


6. Database Design
Collections:
- User
- Skill
- Question
- ExchangeRequest
- ChatMessage
- Notification

Key Relationships:
- One-to-Many: User → Skills, Questions
- Many-to-One: ExchangeRequest.sender/receiver → User
- Many-to-One: ChatMessage → ExchangeRequest
- One-to-One (optional): Notification → ExchangeRequest


7. Real-Time Messaging
- Socket.IO used for sending and receiving messages instantly.
- Messages update in real-time without page reload.
- Message status supports 'read' and 'unread' handling.

8. Skill Quiz Module
- Each skill has MCQ-based quiz questions.
- Users attempt the quiz only once.
- Score is calculated and shown instantly.
- Results include selected answers, correct answers, and explanations.
- Results can be exported as PDF.

9. Google Login with Firebase
- Firebase Auth used for social login.
- On login, Firebase ID token is verified at backend.
- JWT token is issued for session persistence.
- Google users are saved with `isGoogleUser` flag.


10. Challenges Faced & Solutions
# Real-Time Chat
➤ Implemented using Socket.IO; managed events for typing, message delivery, read status.

# Google Login Integration
➤ Firebase with secure JWT issuing for token-based login persistence.

# Complex MongoDB Relations
➤ Designed proper referencing using Mongoose for clear and efficient queries.

# Media Support
➤ Handled user profile and image uploads.

# Quiz Attempt Validation
➤ Ensured only one quiz attempt and validated results securely.

# Auth State Management
➤ Handled token and user state sync using localStorage and React context.

11. Future Scope
- Skill rating and review system.
- Group chat or video call integration.
- Email notifications/reminders.
- Multi-language support.
- AI-based skill recommendations.


Live Link: [Skill Exchange Website](https://skill-exchange-platform-frontend.onrender.com)