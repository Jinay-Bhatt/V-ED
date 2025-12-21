// backend/routes/progress.js
const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireStudent } = require('../middleware/auth');

const router = express.Router();

// Get student's overall progress
router.get('/', authenticateToken, requireStudent, async (req, res) => {
    try {
        const studentId = req.user.userId;

        // Get student's internal ID and data
        const studentResult = await pool.query(
            'SELECT * FROM students WHERE user_id = $1',
            [studentId]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Student not found'
            });
        }

        const student = studentResult.rows[0];
        const studentDbId = student.id;
        const studentGrade = student.class_grade;

        // Get all stats in parallel
        const [completedLessons, totalLessons, playedGames, totalGames, badgesEarned, totalBadges] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM student_lessons WHERE student_id = $1 AND completed = TRUE', [studentDbId]),
            pool.query('SELECT COUNT(*) FROM lessons WHERE grade = $1 AND is_active = true', [studentGrade]),
            pool.query('SELECT COUNT(*) FROM student_games WHERE student_id = $1 AND played = TRUE', [studentDbId]),
            pool.query('SELECT COUNT(*) FROM games WHERE grade = $1 AND is_active = true', [studentGrade]),
            pool.query('SELECT COUNT(*) FROM student_badges WHERE student_id = $1', [studentDbId]),
            pool.query('SELECT COUNT(*) FROM badges')
        ]);

        res.json({
            success: true,
            data: {
                totalPoints: student.points,
                lessonsCompleted: parseInt(completedLessons.rows[0].count),
                totalLessons: parseInt(totalLessons.rows[0].count),
                gamesPlayed: parseInt(playedGames.rows[0].count),
                totalGames: parseInt(totalGames.rows[0].count),
                badgesEarned: parseInt(badgesEarned.rows[0].count),
                totalBadges: parseInt(totalBadges.rows[0].count),
                learningStreak: student.streak,
                totalLearningTime: Math.floor(student.total_time_spent / 60)
            }
        });

    } catch (error) {
        console.error('Progress fetch error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch progress',
            message: error.message 
        });
    }
});

// Get all badges
router.get('/badges', authenticateToken, requireStudent, async (req, res) => {
    try {
        const studentId = req.user.userId;

        // Get student's internal ID
        const studentResult = await pool.query(
            'SELECT id FROM students WHERE user_id = $1',
            [studentId]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Student not found'
            });
        }

        const studentDbId = studentResult.rows[0].id;

        // Get all badges
        const allBadgesResult = await pool.query(
            'SELECT badge_id, name, description, icon FROM badges ORDER BY name'
        );

        // Get earned badges
        const earnedBadgesResult = await pool.query(
            'SELECT badge_id FROM student_badges WHERE student_id = $1',
            [studentDbId]
        );

        const earnedBadgeIds = new Set(earnedBadgesResult.rows.map(row => row.badge_id));

        const badges = allBadgesResult.rows.map(badge => ({
            badgeId: badge.badge_id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            isEarned: earnedBadgeIds.has(badge.badge_id)
        }));

        res.json({
            success: true,
            data: badges
        });

    } catch (error) {
        console.error('Badges fetch error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch badges',
            message: error.message 
        });
    }
});

module.exports = router;
