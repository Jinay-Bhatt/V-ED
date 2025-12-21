// backend/middleware/validation.js
const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

// Student Registration Validation
const validateRegistration = [
    body('rollNumber')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Roll number must be between 3 and 50 characters')
        .matches(/^[A-Za-z0-9-_]+$/)
        .withMessage('Roll number can only contain letters, numbers, hyphens and underscores'),
    
    body('studentName')
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Name must be between 2 and 255 characters')
        .matches(/^[a-zA-Z\s.]+$/)
        .withMessage('Name can only contain letters, spaces and periods'),
    
    body('class')
        .isInt({ min: 1, max: 12 })
        .withMessage('Class must be between 1 and 12'),
    
    body('school')
        .trim()
        .isLength({ min: 3, max: 255 })
        .withMessage('School name must be between 3 and 255 characters'),
    
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
    body('language')
        .optional()
        .isIn(['en', 'hi', 'bn', 'te', 'gu'])
        .withMessage('Invalid language selection'),
    
    handleValidationErrors
];

// Login Validation
const validateLogin = [
    body('rollNumber')
        .trim()
        .notEmpty()
        .withMessage('Roll number is required'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

// Lesson Progress Validation
const validateLessonProgress = [
    body('score')
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage('Score must be between 0 and 100'),
    
    body('timeSpent')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Time spent must be a positive number'),
    
    handleValidationErrors
];

// Game Progress Validation
const validateGameProgress = [
    body('score')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Score must be a positive number'),
    
    body('timeSpent')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Time spent must be a positive number'),
    
    handleValidationErrors
];

// Profile Update Validation
const validateProfileUpdate = [
    body('fullName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Name must be between 2 and 255 characters'),
    
    body('school')
        .optional()
        .trim()
        .isLength({ min: 3, max: 255 })
        .withMessage('School name must be between 3 and 255 characters'),
    
    body('preferredLanguage')
        .optional()
        .isIn(['en', 'hi', 'bn', 'te', 'gu'])
        .withMessage('Invalid language selection'),
    
    handleValidationErrors
];

// Password Change Validation
const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long'),
    
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage('Passwords do not match'),
    
    handleValidationErrors
];

module.exports = {
    validateRegistration,
    validateLogin,
    validateLessonProgress,
    validateGameProgress,
    validateProfileUpdate,
    validatePasswordChange,
    handleValidationErrors
};
