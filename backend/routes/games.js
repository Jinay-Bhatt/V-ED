// backend/routes/games.js
const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireStudent } = require('../middleware/auth');

const router = express.Router();

// Get all games (PUBLIC - no auth required)
router.get('/', async (req, res) => {
    try {
        const { subject, grade, difficulty } = req.query;
        
        let query = 'SELECT * FROM games WHERE is_active = true';
        const params = [];
        let paramCount = 0;

        if (grade) {
            paramCount++;
            query += ` AND grade = $${paramCount}`;
            params.push(parseInt(grade));
        }

        if (subject) {
            paramCount++;
            query += ` AND subject = $${paramCount}`;
            params.push(subject);
        }

        if (difficulty) {
            paramCount++;
            query += ` AND difficulty = $${paramCount}`;
            params.push(difficulty);
        }

        query += ' ORDER BY subject, grade, difficulty, created_at';

        const result = await pool.query(query, params);
        
        const games = result.rows.map(game => ({
            id: game.game_id,
            title: game.title,
            description: game.description,
            subject: game.subject,
            grade: game.grade,
            difficulty: game.difficulty,
            points: game.points_reward,
            icon: game.icon
        }));

        res.json({
            success: true,
            data: games
        });

    } catch (error) {
        console.error('Games fetch error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch games',
            message: error.message 
        });
    }
});

// Get single game by ID
router.get('/:gameId', async (req, res) => {
    try {
        const { gameId } = req.params;

        const result = await pool.query(
            'SELECT * FROM games WHERE game_id = $1 AND is_active = true',
            [gameId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Game not found'
            });
        }

        const game = result.rows[0];

        res.json({
            success: true,
            data: {
                id: game.game_id,
                title: game.title,
                description: game.description,
                subject: game.subject,
                grade: game.grade,
                difficulty: game.difficulty,
                points: game.points_reward,
                icon: game.icon
            }
        });

    } catch (error) {
        console.error('Game fetch error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch game',
            message: error.message 
        });
    }
});

// Play game (PROTECTED)
router.post('/:gameId/play', authenticateToken, requireStudent, async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { gameId } = req.params;
        const { score = 0, timeSpent = 0 } = req.body;

        if (score < 0 || timeSpent < 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Score and time spent cannot be negative' 
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

        // Get game details
        const gameResult = await client.query(
            'SELECT * FROM games WHERE game_id = $1 AND is_active = true',
            [gameId]
        );

        if (gameResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ 
                success: false,
                error: 'Game not found' 
            });
        }

        const game = gameResult.rows[0];
        const pointsReward = game.points_reward;

        let pointsEarned = 0;
        let isFirstTime = false;

        // Check existing progress
        const existingProgress = await client.query(
            'SELECT * FROM student_games WHERE student_id = $1 AND game_id = $2',
            [studentDbId, gameId]
        );

        if (existingProgress.rows.length === 0) {
            // First time playing
            await client.query(
                'INSERT INTO student_games (student_id, game_id, played, score, time_spent, played_at) VALUES ($1, $2, TRUE, $3, $4, NOW())',
                [studentDbId, gameId, score, timeSpent]
            );
            pointsEarned = pointsReward;
            isFirstTime = true;
        } else {
            // Already played - update score if better
            const currentScore = existingProgress.rows[0].score || 0;
            await client.query(
                'UPDATE student_games SET score = GREATEST(score, $1), time_spent = time_spent + $2, played_at = NOW() WHERE student_id = $3 AND game_id = $4',
                [score, timeSpent, studentDbId, gameId]
            );
            
            // Award partial points if score improved
            if (score > currentScore) {
                pointsEarned = Math.floor(pointsReward * 0.5);
            }
        }

        // Update student points
        await client.query(
            'UPDATE students SET points = points + $1, total_time_spent = total_time_spent + $2, last_activity = NOW() WHERE id = $3',
            [pointsEarned, timeSpent, studentDbId]
        );

        await client.query('COMMIT');

        res.json({ 
            success: true,
            message: isFirstTime ? 'Game completed! 🎮' : 'Game played!',
            data: {
                pointsEarned,
                isFirstTime
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Play game error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to play game',
            message: error.message 
        });
    } finally {
        client.release();
    }
});

module.exports = router;
