// frontend/src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { languages } from '../utils/Languages'; // Ensure this import path is correct

const ProfilePage = ({ currentUser, updateProfile, logoutStudent, language, getTranslation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    school: currentUser?.school || '',
    grade: currentUser?.grade || 8,
    language: currentUser?.language || 'en' // Initialize with current user's language
  });

  // Effect to update formData if currentUser changes while not editing
  useEffect(() => {
    if (currentUser && !isEditing) {
      setFormData({
        name: currentUser.name || '',
        school: currentUser.school || '',
        grade: currentUser.grade || 8,
        language: currentUser.language || 'en'
      });
    }
  }, [currentUser, isEditing]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Collect all fields that have changed
    const changedFields = {};
    if (formData.name !== currentUser.name) changedFields.name = formData.name;
    if (formData.school !== currentUser.school) changedFields.school = formData.school;
    if (parseInt(formData.grade) !== currentUser.grade) changedFields.grade = parseInt(formData.grade);
    if (formData.language !== currentUser.language) changedFields.language = formData.language;
    
    if (Object.keys(changedFields).length > 0) {
      updateProfile(changedFields); // Pass an object of changed fields to App.js's updateProfile
    }
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser.name || '',
      school: currentUser.school || '',
      grade: currentUser.grade || 8,
      language: currentUser.language || 'en'
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h2 className="page-title">👤 {getTranslation('profileTitle')}</h2>
      
      <div 
        className="profile-header"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div className="profile-avatar">👤</div>
        <h2 className="profile-name">{currentUser.name}</h2>
        <p className="profile-info">
          {getTranslation('rollNumber')}: {currentUser.rollNumber}
        </p>
        <p className="profile-info">
          {getTranslation('class')} {currentUser.grade} • {currentUser.school}
        </p>
        <div className="profile-points-badge">
          ⭐ {currentUser.points || 0} {getTranslation('points')}
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">{getTranslation('accountSettings')}</h3>
        
        <div className="setting-item">
          <label className="setting-label">{getTranslation('fullName')}:</label>
          <input 
            type="text" 
            name="name"
            value={formData.name} 
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`setting-input ${!isEditing ? 'disabled' : ''}`}
            onFocus={(e) => isEditing && (e.currentTarget.style.borderColor = '#667eea')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e1e5e9')}
          />
        </div>
        
        <div className="setting-item">
          <label className="setting-label">{getTranslation('rollNumber')}:</label>
          <input 
            type="text" 
            value={currentUser.rollNumber} 
            disabled 
            className="setting-input disabled"
          />
          <div className="setting-note">
            {getTranslation('rollNumberNote')}
          </div>
        </div>
        
        <div className="setting-item">
          <label className="setting-label">{getTranslation('class')}:</label>
          <select 
            name="grade"
            value={formData.grade} 
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`setting-select ${!isEditing ? 'disabled' : ''}`}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade =>
              <option key={grade} value={grade}>
                {getTranslation('class')} {grade}
              </option>
            )}
          </select>
        </div>
        
        <div className="setting-item">
          <label className="setting-label">{getTranslation('school')}:</label>
          <input 
            type="text" 
            name="school"
            value={formData.school} 
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`setting-input ${!isEditing ? 'disabled' : ''}`}
            onFocus={(e) => isEditing && (e.currentTarget.style.borderColor = '#667eea')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e1e5e9')}
          />
        </div>
        
        <div className="setting-item">
          <label className="setting-label">{getTranslation('preferredLanguage')}:</label>
          <select 
            name="language"
            value={formData.language} 
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`setting-select ${!isEditing ? 'disabled' : ''}`}
          >
            {Object.values(languages).map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="button-group">
        {!isEditing ? (
          <button 
            className="action-button primary"
            onClick={() => setIsEditing(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ✏️ {getTranslation('editProfile')}
          </button>
        ) : (
          <>
            <button 
              className="action-button success"
              onClick={handleSave}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(40, 167, 69, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              💾 {getTranslation('saveChanges')}
            </button>
            <button 
              className="action-button secondary"
              onClick={handleCancel}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(108, 117, 125, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              ❌ {getTranslation('cancel')}
            </button>
          </>
        )}
      </div>

      <div className="logout-section">
        <button 
          className="logout-button"
          onClick={logoutStudent}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 5px 15px rgba(220, 53, 69, 0.3)';
            e.currentTarget.style.background = '#c82333';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.background = '#dc3545';
          }}
        >
          🚪 {getTranslation('logout')}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
