// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Main authentication middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ 
                success: false,
                error: 'Access token required',
                message: 'Please login to access this resource'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Optional: Check if user still exists and is active
        const userCheck = await pool.query(
            'SELECT id, email, user_type, is_active FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (userCheck.rows.length === 0) {
            return res.status(403).json({
                success: false,
                error: 'User not found',
                message: 'Please login again'
            });
        }

        const user = userCheck.rows[0];

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                error: 'Account deactivated',
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        // Attach user info to request
        req.user = {
            userId: user.id,
            email: user.email,
            userType: user.user_type
        };

        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ 
                success: false,
                error: 'Invalid token',
                message: 'Please login again'
            });
        }
        
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ 
                success: false,
                error: 'Token expired',
                message: 'Your session has expired. Please login again'
            });
        }

        console.error('Auth middleware error:', err);
        return res.status(500).json({
            success: false,
            error: 'Authentication failed',
            message: 'An error occurred during authentication'
        });
    }
};

// Role-based access control middleware
const requireStudent = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required',
            message: 'Please login first'
        });
    }

    if (req.user.userType !== 'student') {
        return res.status(403).json({ 
            success: false,
            error: 'Access denied',
            message: 'Student access required'
        });
    }
    next();
};

const requireTeacher = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required',
            message: 'Please login first'
        });
    }

    if (req.user.userType !== 'teacher') {
        return res.status(403).json({ 
            success: false,
            error: 'Access denied',
            message: 'Teacher access required'
        });
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required',
            message: 'Please login first'
        });
    }

    if (req.user.userType !== 'admin') {
        return res.status(403).json({ 
            success: false,
            error: 'Access denied',
            message: 'Admin access required'
        });
    }
    next();
};

// Allow multiple roles
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required',
                message: 'Please login first'
            });
        }

        if (!allowedRoles.includes(req.user.userType)) {
            return res.status(403).json({
                success: false,
                error: 'Access denied',
                message: `Access restricted to: ${allowedRoles.join(', ')}`
            });
        }
        next();
    };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                userType: decoded.userType
            };
        }
        next();
    } catch (err) {
        // If token is invalid, just continue without user
        next();
    }
};

// Generate JWT token helper
const generateToken = (userId, email, userType) => {
    return jwt.sign(
        { 
            userId, 
            email, 
            userType 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Verify and decode token without middleware
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
};

module.exports = { 
    authenticateToken,
    requireStudent,
    requireTeacher,
    requireAdmin,
    requireRole,
    optionalAuth,
    generateToken,
    verifyToken
};
