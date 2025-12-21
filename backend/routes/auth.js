// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');

const router = express.Router();

// Student Registration
router.post('/register', validateRegistration, async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { 
            rollNumber, 
            studentName, 
            class: classGrade,
            school, 
            language, 
            email, 
            password 
        } = req.body;

        await client.query('BEGIN');

        // Check if roll number already exists
        const rollCheck = await client.query(
            'SELECT id FROM students WHERE roll_number = $1',
            [rollNumber]
        );

        if (rollCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                success: false,
                error: 'Roll number already exists',
                message: 'A student with this roll number is already registered.'
            });
        }

        // Check if email already exists
        const emailCheck = await client.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (emailCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                success: false,
                error: 'Email already registered',
                message: 'This email is already associated with an account.'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user entry
        const userResult = await client.query(
            'INSERT INTO users (email, password_hash, user_type) VALUES ($1, $2, $3) RETURNING id',
            [email, passwordHash, 'student']
        );

        const userId = userResult.rows[0].id;

        // Create student profile
        const studentResult = await client.query(
            'INSERT INTO students (user_id, roll_number, full_name, class_grade, school_name, preferred_language, login_time) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
            [userId, rollNumber, studentName, classGrade, school, language || 'en']
        );

        await client.query('COMMIT');

        const student = studentResult.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId, 
                userType: 'student'
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful! Welcome to V-Ed Platform! 🎉',
            token,
            user: {
                id: userId,
                studentId: student.id,
                rollNumber,
                name: student.full_name,
                grade: student.class_grade,
                school: student.school_name,
                language: student.preferred_language,
                points: student.points,
                streak: student.streak,
                totalTimeSpent: student.total_time_spent,
                completedLessons: [],
                gamesPlayed: [],
                badges: [],
                userType: 'student'
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Registration failed',
            message: error.message || 'An unexpected error occurred during registration.'
        });
    } finally {
        client.release();
    }
});

// Student Login
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { rollNumber, password } = req.body;

        // Get student with associated user details
        const result = await pool.query(`
            SELECT s.*, u.email, u.password_hash, u.id as user_id
            FROM students s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.roll_number = $1 AND u.is_active = true
        `, [rollNumber]);

        if (result.rows.length === 0) {
            return res.status(401).json({ 
                success: false,
                error: 'Authentication failed',
                message: 'Invalid roll number or password.'
            });
        }

        const student = result.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, student.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false,
                error: 'Authentication failed',
                message: 'Invalid roll number or password.'
            });
        }

        // Update login time and last activity
        await pool.query(
            'UPDATE students SET login_time = NOW(), last_activity = NOW() WHERE id = $1',
            [student.id]
        );

        // Fetch completed lessons
        const completedLessonsResult = await pool.query(
            'SELECT lesson_id FROM student_lessons WHERE student_id = $1 AND completed = true',
            [student.id]
        );
        const completedLessons = completedLessonsResult.rows.map(row => row.lesson_id);

        // Fetch played games
        const playedGamesResult = await pool.query(
            'SELECT game_id FROM student_games WHERE student_id = $1 AND played = true',
            [student.id]
        );
        const gamesPlayed = playedGamesResult.rows.map(row => row.game_id);

        // Fetch earned badges
        const badgesResult = await pool.query(
            'SELECT badge_id FROM student_badges WHERE student_id = $1',
            [student.id]
        );
        const badges = badgesResult.rows.map(row => row.badge_id);

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: student.user_id, 
                userType: 'student'
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful! Welcome back to V-Ed Platform! 🎉',
            token,
            user: {
                id: student.user_id,
                studentId: student.id,
                rollNumber: student.roll_number,
                name: student.full_name,
                grade: student.class_grade,
                school: student.school_name,
                language: student.preferred_language,
                points: student.points,
                streak: student.streak,
                totalTimeSpent: student.total_time_spent,
                completedLessons: completedLessons,
                gamesPlayed: gamesPlayed,
                badges: badges,
                userType: 'student'
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Login failed',
            message: error.message || 'An unexpected error occurred during login.'
        });
    }
});

// Verify token endpoint
router.get('/verify', authenticateToken, async (req, res) => {
    try {
        const studentId = req.user.userId;

        const result = await pool.query(`
            SELECT s.*, u.email
            FROM students s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.user_id = $1 AND u.is_active = true
        `, [studentId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'User not found',
                message: 'Student profile not found or inactive.'
            });
        }

        const student = result.rows[0];

        // Fetch completed lessons
        const completedLessonsResult = await pool.query(
            'SELECT lesson_id FROM student_lessons WHERE student_id = $1 AND completed = true',
            [student.id]
        );
        const completedLessons = completedLessonsResult.rows.map(row => row.lesson_id);

        // Fetch played games
        const playedGamesResult = await pool.query(
            'SELECT game_id FROM student_games WHERE student_id = $1 AND played = true',
            [student.id]
        );
        const gamesPlayed = playedGamesResult.rows.map(row => row.game_id);

        // Fetch earned badges
        const badgesResult = await pool.query(
            'SELECT badge_id FROM student_badges WHERE student_id = $1',
            [student.id]
        );
        const badges = badgesResult.rows.map(row => row.badge_id);

        // Update last activity
        await pool.query('UPDATE students SET last_activity = NOW() WHERE id = $1', [student.id]);

        res.json({
            success: true,
            user: {
                id: student.user_id,
                studentId: student.id,
                rollNumber: student.roll_number,
                name: student.full_name,
                grade: student.class_grade,
                school: student.school_name,
                language: student.preferred_language,
                points: student.points,
                streak: student.streak,
                totalTimeSpent: student.total_time_spent,
                email: student.email,
                completedLessons: completedLessons,
                gamesPlayed: gamesPlayed,
                badges: badges,
                userType: 'student'
            }
        });

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Token verification failed',
            message: error.message || 'An unexpected error occurred during token verification.'
        });
    }
});

module.exports = router;
