import { data } from 'react-router-dom';
import axiosInstance from '../Utils/axios'

export const signup = (formData) => axiosInstance.post('/auth/signup', formData);
export const verifyOtp = (otpData) => axiosInstance.post('/auth/verify', otpData);
export const login = (formData) => axiosInstance.post('/auth/login', formData);
export const forgotPassword = (data) => axiosInstance.post('/auth/forgot', data);
export const resetPassword = (data) => axiosInstance.post('/auth/reset', data);
export const getCurrentUser = () => axiosInstance.get('/auth/me');
// export const googleLogin = (tokenData) => {
//   return axiosInstance.fetch('/auth/google-login', tokenData);
// };


//user profile 
export const getUserProfile = async () => { return axiosInstance.get('/users/profile'); };
export const updateUserProfile = (updatedData) => axiosInstance.put('/users/profile', updatedData);
// Upload profile picture
export const uploadProfilePicture = async (formData) => {
  return axiosInstance.put('/users/upload-img', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Delete 
export const deleteUserProfile = () => axiosInstance.delete('/users/profile');
export const getUserProgress = async () => {
  return axiosInstance.get("/users/progress");
};



// Create skill
export const createSkill = (formData) => axiosInstance.post('/skills', formData);
export const addQuestionsToSkill = (id, payload) =>
  axiosInstance.post(`/skills/add-questions/${id}`, payload);
export const getQuestionsBySkill = (id) =>
  axiosInstance.get(`/skills/questions/${id}`);
export const updateQuestionById = (id, question) =>
  axiosInstance.put(`/skills/questions/${id}`, question);
export const deleteQuestionById = (id) =>
  axiosInstance.delete(`/skills/questions/${id}`);
export const getMySkills = () => axiosInstance.get('/skills/my-skills');
export const updateSkill = (id, updatedData) => axiosInstance.put(`/skills/${id}`, updatedData);
export const deleteSkill = (id) => axiosInstance.delete(`/skills/${id}`);
export const getSkillById = (id) => axiosInstance.get(`/skills/${id}`);
export const getAllSkills = () => axiosInstance.get('/skills');
export const getExploreSkills = () => axiosInstance.get('/skills/explore');



//Exchange API
export const sendExchangeRequest = (data) => axiosInstance.post('/exchanges', data);
export const getMyExchangeRequests = () => axiosInstance.get('/exchanges');
export const getExchangeRequestCounts = () => axiosInstance.get('/exchanges/counts');
export const acceptExchangeRequest = (requestId) => axiosInstance.put(`exchanges/${requestId._id}/accept`);
export const rejectExchangeRequest = (requestId) => axiosInstance.put(`exchanges/${requestId._id}/reject`);
export const completeExchangeRequest = (id) => axiosInstance.put(`/exchanges/${id}/complete`);
//  Submit Answers for Exchange Request
export const submitAnswers = async (payload) => {
  const res = await axiosInstance.post('/exchanges/submit-answers', payload);
  return res.data;
};

export const getQuizResult = async (requestId) => {
  const res = await axiosInstance.get(`/exchanges/${requestId}/quiz-result`);
  return res.data;
};



export const getPassedSkills = () =>
  axiosInstance.get('/exchanges/quiz/passed');

// Get all notifications
export const getNotifications = () => axiosInstance.get('/notifications');
export const markNotificationAsRead = (id) => axiosInstance.put(`/notifications/${id}/read`);
export const getAcceptedChats = () => axiosInstance.get('/chat/accepted');
export const getChatMessages = (requestId) => axiosInstance.get(`/chat/${requestId}`);
export const markMessagesAsRead = (requestId) => {
  return axiosInstance.put(`/chat/${requestId}/read`);
};

export const sendChatMessage = (requestId, formData) =>
  axiosInstance.post(`/chat/${requestId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

