// backend/routes/lessons.js
const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireStudent } = require('../middleware/auth');

const router = express.Router();

// Get all lessons (PUBLIC - no auth required)
router.get('/', async (req, res) => {
    try {
        const { subject, grade, difficulty } = req.query;
        
        let query = 'SELECT * FROM lessons WHERE is_active = true';
        const params = [];
        let paramCount = 0;

        if (grade) {
            paramCount++;
            query += ` AND grade = $${paramCount}`;
            params.push(parseInt(grade));
        }

        if (subject) {
            paramCount++;
            query += ` AND LOWER(subject) = LOWER($${paramCount})`;
            params.push(subject);
        }

        if (difficulty) {
            paramCount++;
            query += ` AND LOWER(difficulty) = LOWER($${paramCount})`;
            params.push(difficulty);
        }

        query += ' ORDER BY subject, grade, difficulty, created_at';

        console.log('Lessons query:', query, 'params:', params);
        const result = await pool.query(query, params);
        
        const lessons = result.rows.map(lesson => ({
            id: lesson.lesson_id,
            title: lesson.title,
            description: lesson.description,
            subject: lesson.subject,
            grade: lesson.grade,
            duration: lesson.duration,
            points: lesson.points_reward,
            difficulty: lesson.difficulty
        }));

        console.log(`Found ${lessons.length} lessons`);

        res.json({
            success: true,
            data: lessons
        });

    } catch (error) {
        console.error('Lessons fetch error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch lessons',
            message: error.message 
        });
    }
});

// Get single lesson by ID
router.get('/:lessonId', async (req, res) => {
    try {
        const { lessonId } = req.params;

        const result = await pool.query(
            'SELECT * FROM lessons WHERE lesson_id = $1 AND is_active = true',
            [lessonId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Lesson not found'
            });
        }

        const lesson = result.rows[0];

        res.json({
            success: true,
            data: {
                id: lesson.lesson_id,
                title: lesson.title,
                description: lesson.description,
                subject: lesson.subject,
                grade: lesson.grade,
                duration: lesson.duration,
                points: lesson.points_reward,
                difficulty: lesson.difficulty
            }
        });

    } catch (error) {
        console.error('Lesson fetch error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch lesson',
            message: error.message 
        });
    }
});

// Complete lesson (PROTECTED)
router.post('/:lessonId/complete', authenticateToken, requireStudent, async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { lessonId } = req.params;
        const { score = 100, timeSpent = 0 } = req.body;

        if (score < 0 || score > 100) {
            return res.status(400).json({ 
                success: false,
                error: 'Score must be between 0 and 100' 
            });
        }

        await client.query('BEGIN');

        const studentId = req.user.userId;

        // Get student's internal ID
        const studentResult = await client.query(
            'SELECT id FROM students WHERE user_id = $1',
            [studentId]
        );

        if (studentResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ 
                success: false,
                error: 'Student not found' 
            });
        }

        const studentDbId = studentResult.rows[0].id;

        // Get lesson details
        const lessonResult = await client.query(
            'SELECT * FROM lessons WHERE lesson_id = $1 AND is_active = true',
            [lessonId]
        );

        if (lessonResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ 
                success: false,
                error: 'Lesson not found' 
            });
        }

        const lesson = lessonResult.rows[0];
        const pointsReward = lesson.points_reward;

        let pointsEarned = 0;
        let isFirstCompletion = false;

        // Check existing progress
        const existingProgress = await client.query(
            'SELECT * FROM student_lessons WHERE student_id = $1 AND lesson_id = $2',
            [studentDbId, lessonId]
        );

        if (existingProgress.rows.length === 0 || !existingProgress.rows[0].completed) {
            // First time completing
            if (existingProgress.rows.length === 0) {
                await client.query(
                    'INSERT INTO student_lessons (student_id, lesson_id, completed, score, time_spent, completed_at) VALUES ($1, $2, TRUE, $3, $4, NOW())',
                    [studentDbId, lessonId, score, timeSpent]
                );
            } else {
                await client.query(
                    'UPDATE student_lessons SET completed = TRUE, score = $1, time_spent = time_spent + $2, completed_at = NOW() WHERE student_id = $3 AND lesson_id = $4',
                    [score, timeSpent, studentDbId, lessonId]
                );
            }
            pointsEarned = pointsReward;
            isFirstCompletion = true;
        } else {
            // Already completed
            await client.query(
                'UPDATE student_lessons SET score = GREATEST(score, $1), time_spent = time_spent + $2 WHERE student_id = $3 AND lesson_id = $4',
                [score, timeSpent, studentDbId, lessonId]
            );
        }

        // Update student points
        await client.query(
            'UPDATE students SET points = points + $1, total_time_spent = total_time_spent + $2, last_activity = NOW() WHERE id = $3',
            [pointsEarned, timeSpent, studentDbId]
        );

        await client.query('COMMIT');

        res.json({ 
            success: true,
            message: isFirstCompletion ? 'Lesson completed! 🎉' : 'Lesson updated!',
            data: {
                pointsEarned,
                isFirstCompletion
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Complete lesson error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to complete lesson',
            message: error.message 
        });
    } finally {
        client.release();
    }
});

module.exports = router;