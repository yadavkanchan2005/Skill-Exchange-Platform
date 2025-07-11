import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/HomePage/Home';
import ThankYou from './pages/ThankYou';
import Signup from './pages/SignupPage/Signup'
import VerifyOtp from './pages/verifyOtpComponents/verifyOtp';
import Login from './pages/LoginPage/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Dashboard from './pages/DashboardPage/Dashboard';
import EditProfile from './pages/ProfilePage/EditProfile';
import ViewProfile from './pages/ProfilePage/ViewProfile';
import MySkills from './pages/SkillsPage/MySkillPage/MySkills';
import CreateSkill from './pages/SkillsPage/CreateSkillPage/CreateSkill';
import UpdateSkill from './pages/SkillsPage/UpdateskillPage/UpdateSkill';
import ViewSkills from './pages/SkillsPage/ViewSkillsPage/ViewSkills';
import ExploreSkills from './pages/SkillsPage/ExploreSkillPage/ExploreSkill';
import NotificationPage from './pages/Notification/NotificationPage';
import MessagesPage from './pages/MessagesPage/MessagesPage';
import ExchangeRequests from './pages/ExchangeRequests/ExchangeRequests';
import SkillQuestions from './components/SkillQuestions/SkillQuetions';
import AboutUs from './components/aboutUscomponenets/about';
import ContactUs from './components/contactUscomponents/contactus';

import { login } from './api/auth';



function App() {

  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/my-profile" element={<ViewProfile />} />
      <Route path="/my-skill" element={<MySkills />} />
      <Route path="/my-skill/create" element={<CreateSkill />} />
      <Route path="/my-skill/update/:id" element={<UpdateSkill />} />
      <Route path="/my-skill/view" element={<ViewSkills />} />
      <Route path="/explore-skills" element={<ExploreSkills />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/exchange-requests" element={<ExchangeRequests />} />
      <Route path="/add-question/:id" element={<SkillQuestions />} />
      
    </Routes>



  );
}

export default App;
