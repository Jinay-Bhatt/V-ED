// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import ApiService from '../services/api';
import { languages as allLanguages, showNotification } from '../utils/Languages';

const LoginPage = ({ onLogin, getTranslation, language }) => {
    const [isLogin, setIsLogin] = useState(true); // true for login, false for register
    const [formData, setFormData] = useState({
        rollNumber: '',
        studentName: '', // Only for registration
        class: '',       // Only for registration
        school: '',      // Only for registration
        language: 'en',  // Only for registration
        email: '',       // Only for registration
        password: ''     // For both login and registration
    });
    const [message, setMessage] = useState(''); // Local message for form-specific feedback
    const [loading, setLoading] = useState(false);
    const [showDemo, setShowDemo] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(''); // Clear previous local messages

        try {
            let result;
            if (isLogin) {
                // Login requires rollNumber and password
                result = await ApiService.loginStudent({
                    rollNumber: formData.rollNumber,
                    password: formData.password
                });
            } else {
                // Registration requires all fields (including password)
                result = await ApiService.registerStudent({
                    rollNumber: formData.rollNumber,
                    studentName: formData.studentName,
                    class: parseInt(formData.class), // Ensure class is an integer
                    school: formData.school,
                    language: formData.language,
                    email: formData.email,
                    password: formData.password
                });
            }

            // If successful, show global notification and call onLogin in App.js
            showNotification(result.message, 'success');
            onLogin(result.user, result.token);
            
        } catch (error) {
            // If error, show global error notification and local message
            showNotification(error.message || getTranslation('loginFailed'), 'error');
            setMessage({ type: 'error', text: error.message || getTranslation('loginFailed') });
        } finally {
            setLoading(false);
        }
    };

    const loginDemo = async (rollNumber, name, classNum, school, langCode) => {
    try {
        // Make an actual API call to your backend with demo credentials
        const result = await ApiService.loginStudent({
            rollNumber: rollNumber,
            password: 'demo123' // Use the actual demo password from your database
        });

        setShowDemo(false);
        showNotification(`${getTranslation('demoLoginSuccess')} ${name}! 🎮`, 'success');
        onLogin(result.user, result.token); // Pass the actual backend response
        
    } catch (error) {
        // If backend demo doesn't exist, fall back to mock data
        console.warn('Demo account not found in backend, using mock data');
        
        const demoData = {
            id: Math.floor(Math.random() * 1000),
            studentId: Math.floor(Math.random() * 1000),
            name: name,
            rollNumber: rollNumber,
            grade: parseInt(classNum),
            school: school,
            language: langCode,
            points: Math.floor(Math.random() * 500) + 200,
            badges: ['first_lesson', 'point_collector'],
            completedLessons: ['math_rational_numbers', 'science_cell_structure'],
            gamesPlayed: ['math_quiz_8'],
            streak: Math.floor(Math.random() * 10) + 1,
            totalTimeSpent: Math.floor(Math.random() * 1000) + 100,
            userType: 'student'
        };

        const dummyToken = 'dummy_token_for_demo_' + Math.random().toString(36).substring(2, 15);
        
        setShowDemo(false);
        showNotification(`${getTranslation('demoLoginSuccess')} ${name}! 🎮`, 'success');
        onLogin(demoData, dummyToken);
    }
};


    // Helper to get native language name for demo accounts
    const getNativeLangName = (langCode) => {
        return allLanguages[langCode]?.nativeName || langCode;
    };

    return (
        <div className="login-page-wrapper"> {/* Outer wrapper */}
            <div className="login-container"> {/* Inner container for the card and modal */}
                <div className="login-card"> {/* The main login/registration card */}
                    {message.text && (
                        <div className={`login-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}
                    
                    <div className="login-header">
                        <h1>🎓 {getTranslation('platform')}</h1>
                        <p>{isLogin ? getTranslation('studentLogin') : getTranslation('studentRegistration')}</p>
                    </div>
                    
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="rollNumber">{getTranslation('rollNumberLabel')}</label>
                            <input
                                type="text"
                                id="rollNumber"
                                name="rollNumber"
                                placeholder={getTranslation('rollNumberPlaceholder')}
                                value={formData.rollNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        {!isLogin && ( // Render these fields only for registration
                            <>
                                <div className="form-group">
                                    <label htmlFor="studentName">{getTranslation('fullNameLabel')}</label>
                                    <input
                                        type="text"
                                        id="studentName"
                                        name="studentName"
                                        placeholder={getTranslation('fullNamePlaceholder')}
                                        value={formData.studentName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="class">{getTranslation('classLabel')}</label>
                                    <select
                                        id="class"
                                        name="class"
                                        value={formData.class}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">{getTranslation('selectClass')}</option>
                                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(grade => (
                                            <option key={grade} value={grade}>
                                                {getTranslation('class')} {grade}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="school">{getTranslation('schoolLabel')}</label>
                                    <input
                                        type="text"
                                        id="school"
                                        name="school"
                                        placeholder={getTranslation('schoolPlaceholder')}
                                        value={formData.school}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="language">{getTranslation('languageLabel')}</label>
                                    <select
                                        id="language"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="en">English</option>
                                        <option value="hi">हिन्दी (Hindi)</option>
                                        <option value="bn">বাংলা (Bengali)</option>
                                        <option value="te">తెలుగు (Telugu)</option>
                                        <option value="gu">ગુજરાતી (Gujarati)</option>
                                    </select>
                                </div>
                            </>
                        )}
                        
                        {/* Password field always renders for both login and registration */}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? getTranslation('loading') : (isLogin ? getTranslation('signIn') : getTranslation('startLearning'))}
                        </button>
                    </form>
                    
                    <div className="login-footer">
                        <p>
                            {isLogin ? getTranslation('newStudent') : getTranslation('alreadyHaveAccount')}
                            <a onClick={() => {
                                setIsLogin(!isLogin);
                                setMessage(''); // Clear local message on toggle
                                setFormData(prev => ({ // Reset registration specific fields on toggle
                                    ...prev,
                                    studentName: '', class: '', school: '', language: 'en', email: ''
                                }));
                            }}>
                                {isLogin ? getTranslation('createAccount') : getTranslation('signIn')}
                            </a>
                        </p>
                        <p>
                            <a href="#" onClick={(e) => { e.preventDefault(); setShowDemo(true); }}>📝 {getTranslation('tryDemo')}</a>
                        </p>
                    </div>
                </div> {/* End login-card */}
                
                {/* Demo Login Modal */}
                {showDemo && (
                    <div className="demo-modal show" onClick={(e) => e.target.classList.contains('demo-modal') && setShowDemo(false)}>
                        <div className="demo-content">
                            <span className="close" onClick={() => setShowDemo(false)}>&times;</span>
                            <h3>{getTranslation('demoAccounts')}</h3>
                            <div className="demo-accounts">
                                <div 
                                    className="demo-account" 
                                    onClick={() => loginDemo('DEMO001', 'Rahul Kumar', '8', 'Village Pathshala', 'hi')}
                                >
                                    <h4>Rahul Kumar</h4>
                                    <p>Roll: DEMO001 | {getTranslation('class')} 8</p>
                                    <p>{getTranslation('points')}: 450 | {getTranslation('lessons')}: 12</p>
                                    <p>{getTranslation('preferredLanguage')}: {getNativeLangName('hi')}</p>
                                </div>
                                <div 
                                    className="demo-account" 
                                    onClick={() => loginDemo('DEMO002', 'Priya Sharma', '10', 'Rural High School', 'bn')}
                                >
                                    <h4>Priya Sharma</h4>
                                    <p>Roll: DEMO002 | {getTranslation('class')} 10</p>
                                    <p>{getTranslation('points')}: 680 | {getTranslation('lessons')}: 18</p>
                                    <p>{getTranslation('preferredLanguage')}: {getNativeLangName('bn')}</p>
                                </div>
                                <div 
                                    className="demo-account" 
                                    onClick={() => loginDemo('DEMO003', 'Arjun Singh', '6', 'Govt. Primary School', 'te')}
                                >
                                    <h4>Arjun Singh</h4>
                                    <p>Roll: DEMO003 | {getTranslation('class')} 6</p>
                                    <p>{getTranslation('points')}: 230 | {getTranslation('lessons')}: 8</p>
                                    <p>{getTranslation('preferredLanguage')}: {getNativeLangName('te')}</p>
                                </div>
                            </div>
                        </div> 
                    </div> 
                )}
            </div> { /* End login-container */ }
        </div> /* End login-page-wrapper */
    );
};

export default LoginPage;
