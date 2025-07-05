import React from 'react';

const ProfileHeader = ({ user, onEdit }) => {
    if (!user) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="profile-header">
            <img
                src={user.profilePicture
                    ? `http://localhost:3000/uploads/${user.profilePicture}`
                    : '/default-profile.png'
                }
                alt="Profile"
                className="profile-img"
            />
            <h2>{user.name || 'No Name'}</h2>
            <p>{user.email || 'No Email'}</p>
            <button onClick={onEdit}>Edit Profile</button>
        </div>
    );
};

export default ProfileHeader;
