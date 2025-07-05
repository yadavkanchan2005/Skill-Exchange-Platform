import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile, uploadProfilePicture } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SidebarComponent/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    education: '',
    languages: '',
    experienceLevel: '',
    skills: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setUser(profileData);
        setFormData({
          name: profileData.name || '',
          gender: profileData.gender || '',
          dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.slice(0, 10) : '',
          education: profileData.education || '',
          languages: profileData.languages ? profileData.languages.join(', ') : '',
          experienceLevel: profileData.experienceLevel || '',
          skills: profileData.skills ? profileData.skills.map(skill => skill.name).join(', ') : '',
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        toast.error('Failed to load profile. Please try again later.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setImagePreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagePreviewUrl(null);
    }
  }, [selectedImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        languages: formData.languages.split(',').map(lang => lang.trim()).filter(Boolean),
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      };

      await updateUserProfile(payload);

      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append('profilePicture', selectedImage);
        await uploadProfilePicture(imageFormData);
      }

      toast.success('Profile updated successfully!');
      setSaving(false);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="row">
        <div className="col-md-2 p-0">
          <Sidebar />
        </div>
        <div className="col-md-10 mt-4">
          <div className="d-flex flex-column align-items-center">
            <h2 className="mb-4 fw-bold">Edit Profile</h2>

            <div className="card p-4 shadow" style={{ maxWidth: '900px', width: '100%' }}>
              <div className="row">
                <div className="col-md-4 text-center">
                  {(imagePreviewUrl || user?.profilePicture) && (
                    <img
                      src={imagePreviewUrl || `http://localhost:3000/uploads/${user.profilePicture}`}
                      alt="Profile"
                      className="img-fluid rounded-circle mb-2"
                      style={{ width: '180px', height: '180px', objectFit: 'cover' }}
                    />
                  )}

                  <label htmlFor="profilePicture" className="form-label fw-bold mt-3">Update Profile Picture</label>
                  <input
                    type="file"
                    className="form-control"
                    id="profilePicture"
                    accept="image/*"
                    onChange={e => setSelectedImage(e.target.files[0])}
                  />
                </div>

                {/* Right Form */}
                <div className="col-md-8">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Gender</label>
                        <select
                          className="form-select"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          className="form-control"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Education</label>
                        <input
                          type="text"
                          className="form-control"
                          name="education"
                          value={formData.education}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-12 mb-3">
                        <label className="form-label">Languages (comma separated)</label>
                        <input
                          type="text"
                          className="form-control"
                          name="languages"
                          value={formData.languages}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Experience Level</label>
                        <select
                          className="form-select"
                          name="experienceLevel"
                          value={formData.experienceLevel}
                          onChange={handleChange}
                        >
                          <option value="">Select Experience Level</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Skills (comma separated)</label>
                        <input
                          type="text"
                          className="form-control"
                          name="skills"
                          value={formData.skills}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12 text-end">
                        {saving ? (
                          <button className="btn btn-primary" disabled>Saving...</button>
                        ) : (
                          <button className="btn btn-primary">Save Profile</button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
