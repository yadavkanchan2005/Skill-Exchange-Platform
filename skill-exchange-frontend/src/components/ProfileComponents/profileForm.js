// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile, uploadProfilePicture } from '../../api/auth';
import ProfileForm from '../../components/ProfileComponents/profileForm';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserProfile();
                setUser(res.data);
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
                if (err.response && err.response.status === 401) {
                    alert('Session expired. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    useEffect(() => {
        if (selectedImage) {
            const objectUrl = URL.createObjectURL(selectedImage);
            setImagePreviewUrl(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setImagePreviewUrl(null);
        }
    }, [selectedImage]);

    const handleProfileUpdate = async (data) => {
        try {
            await updateUserProfile(data);

            if (selectedImage) {
                const formData = new FormData();
                formData.append('profilePicture', selectedImage);
                await uploadProfilePicture(formData);
            }

            navigate('/dashboard');
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile.');
        }
    };

 
    if (loading) return <div className="container mt-4"><p>Loading...</p></div>;
    if (!user) return <div className="container mt-4"><p>Failed to load user profile.</p></div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Edit Profile</h2>

            <div className="mb-3">
                <label htmlFor="profilePicture" className="form-label fw-bold">Upload Profile Picture</label>
                <input
                    type="file"
                    className="form-control"
                    id="profilePicture"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                />
            </div>

            {imagePreviewUrl && (
                <div className="mb-3 mt-3">
                    <p className="fw-semibold">Preview:</p>
                    <img
                        src={imagePreviewUrl}
                        alt="Profile Preview"
                        className="img-thumbnail"
                        style={{ maxWidth: '200px', height: 'auto' }}
                    />
                </div>
            )}

            <ProfileForm user={user} onSave={handleProfileUpdate} />
        </div>
    );
};

export default Profile;
