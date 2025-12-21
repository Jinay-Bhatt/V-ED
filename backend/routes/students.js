// backend/routes/students.js
const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireStudent } = require('../middleware/auth');
const { validateProfileUpdate, validatePasswordChange } = require('../middleware/validation');

const router = express.Router();

// Get student profile
router.get('/profile', authenticateToken, requireStudent, async (req, res) => {
    try {
        const studentId = req.user.userId;

        const result = await pool.query(`
            SELECT s.*, u.email
            FROM students s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.user_id = \$1 AND u.is_active = true
        `, [studentId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Student profile not found',
                message: 'Your profile could not be found.'
            });
        }

        const student = result.rows[0];

        // Fetch all related data in parallel
        const [completedLessons, playedGames, badges] = await Promise.all([
            pool.query(
                `SELECT sl.lesson_id, sl.score, sl.completed_at, l.title, l.subject, l.points_reward
                 FROM student_lessons sl
                 JOIN lessons l ON sl.lesson_id = l.lesson_id
                 WHERE sl.student_id = \$1 AND sl.completed = true
                 ORDER BY sl.completed_at DESC`,
                [student.id]
            ),
            pool.query(
                `SELECT sg.game_id, sg.high_score, sg.times_played, g.title, g.icon
                 FROM student_games sg
                 JOIN games g ON sg.game_id = g.game_id
                 WHERE sg.student_id = \$1 AND sg.played = true
                 ORDER BY sg.played_at DESC`,
                [student.id]
            ),
            pool.query(
                `SELECT sb.badge_id, b.name, b.icon, b.description, b.rarity, sb.earned_at
                 FROM student_badges sb
                 JOIN badges b ON sb.badge_id = b.badge_id
                 WHERE sb.student_id = \$1
                 ORDER BY sb.earned_at DESC`,
                [student.id]
            )
        ]);

        res.json({
            success: true,
            data: {
                id: student.user_id,
                studentId: student.id,
                rollNumber: student.roll_number,
                name: student.full_name,
                email: student.email,
                grade: student.class_grade,
                school: student.school_name,
                language: student.preferred_language,
                points: student.points,
                streak: student.streak,
                totalTimeSpent: student.total_time_spent,
                lastActivity: student.last_activity,
                createdAt: student.created_at,
                completedLessons: completedLessons.rows.map(row => ({
                    lessonId: row.lesson_id,
                    title: row.title,
                    subject: row.subject,
                    score: row.score,
                    pointsEarned: row.points_reward,
                    completedAt: row.completed_at
                })),
                gamesPlayed: playedGames.rows.map(row => ({
                    gameId: row.game_id,
                    title: row.title,
                    icon: row.icon,
                    highScore: row.high_score,
                    timesPlayed: row.times_played
                })),
                badges: badges.rows.map(row => ({
                    badgeId: row.badge_id,
                    name: row.name,
                    icon: row.icon,
                    description: row.description,
                    rarity: row.rarity,
                    earnedAt: row.earned_at
                })),
                userType: 'student'
            }
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch profile',
            message: error.message 
        });
    }
});

// Update student profile
router.put('/profile', authenticateToken, requireStudent, validateProfileUpdate, async (req, res) => {
    const client = await pool.connect();
    
    try {
        const studentId = req.user.userId;
        const { fullName, school, preferredLanguage } = req.body;
        
        const updates = [];
        const params = [];
        let paramCount = 0;

        if (fullName !== undefined) {
            paramCount++;
            updates.push(`full_name = $${paramCount}`);
            params.push(fullName);
        }
        if (school !== undefined) {
            paramCount++;
            updates.push(`school_name = $${paramCount}`);
            params.push(school);
        }
        if (preferredLanguage !== undefined) {
            paramCount++;
            updates.push(`preferred_language = $${paramCount}`);
            params.push(preferredLanguage);
        }

        if (updates.length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'No valid fields provided for update',
                message: 'Please provide at least one field to update.'
            });
        }

        paramCount++;
        const updateQuery = `
            UPDATE students 
            SET ${updates.join(', ')}, updated_at = NOW() 
            WHERE user_id = $${paramCount} 
            RETURNING *
        `;
        params.push(studentId);

        const result = await client.query(updateQuery, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Student not found',
                message: 'Your profile could not be found.'
            });
        }

        const updatedStudent = result.rows[0];

        res.json({
            success: true,
            message: 'Profile updated successfully! ✨',
            data: {
                id: studentId,
                studentId: updatedStudent.id,
                rollNumber: updatedStudent.roll_number,
                name: updatedStudent.full_name,
                grade: updatedStudent.class_grade,
                school: updatedStudent.school_name,
                language: updatedStudent.preferred_language,
                points: updatedStudent.points,
                streak: updatedStudent.streak,
                totalTimeSpent: updatedStudent.total_time_spent,
                userType: 'student'
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update profile',
            message: error.message 
        });
    } finally {
        client.release();
    }
});

// Get student dashboard stats
router.get('/dashboard', authenticateToken, requireStudent, async (req, res) => {
    try {
        const studentId = req.user.userId;

        // Get student basic info
        const studentResult = await pool.query(
            'SELECT * FROM students WHERE user_id = $1',
            [studentId]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Student not found',
                message: 'Your profile could not be found.'
            });
        }

        const student = studentResult.rows[0];

        // Get comprehensive stats
        const [lessonsStats, gamesStats, badgesCount, recentActivity, subjectProgress] = await Promise.all([
            // Lessons stats
            pool.query(
                `SELECT 
                    COUNT(*) FILTER (WHERE completed = true) as completed,
                    COUNT(*) FILTER (WHERE completed = false) as in_progress,
                    AVG(score) FILTER (WHERE completed = true) as avg_score
                 FROM student_lessons
                 WHERE student_id = \$1`,
                [student.id]
            ),
            // Games stats
            pool.query(
                `SELECT 
                    COUNT(*) as games_played,
                    SUM(times_played) as total_plays,
                    AVG(high_score) as avg_high_score
                 FROM student_games
                 WHERE student_id = \$1 AND played = true`,
                [student.id]
            ),
            // Badges count
            pool.query(
                'SELECT COUNT(*) as total FROM student_badges WHERE student_id = $1',
                [student.id]
            ),
            // Recent activity (last 7 days)
            pool.query(
                `SELECT 
                    activity_date,
                    lessons_completed,
                    games_played,
                    points_earned,
                    time_spent
                 FROM daily_activity
                 WHERE student_id = \$1 
                 AND activity_date >= CURRENT_DATE - INTERVAL '7 days'
                 ORDER BY activity_date DESC`,
                [student.id]
            ),
            // Subject-wise progress
            pool.query(
                `SELECT 
                    l.subject,
                    COUNT(*) as total_lessons,
                    AVG(sl.score) as avg_score
                 FROM student_lessons sl
                 JOIN lessons l ON sl.lesson_id = l.lesson_id
                 WHERE sl.student_id = \$1 AND sl.completed = true
                 GROUP BY l.subject`,
                [student.id]
            )
        ]);

        res.json({
            success: true,
            data: {
                profile: {
                    name: student.full_name,
                    rollNumber: student.roll_number,
                    grade: student.class_grade,
                    school: student.school_name,
                    points: student.points,
                    streak: student.streak
                },
                stats: {
                    lessons: {
                        completed: parseInt(lessonsStats.rows[0].completed),
                        inProgress: parseInt(lessonsStats.rows[0].in_progress),
                        averageScore: Math.round(parseFloat(lessonsStats.rows[0].avg_score) || 0)
                    },
                    games: {
                        uniqueGamesPlayed: parseInt(gamesStats.rows[0].games_played) || 0,
                        totalPlays: parseInt(gamesStats.rows[0].total_plays) || 0,
                        averageHighScore: Math.round(parseFloat(gamesStats.rows[0].avg_high_score) || 0)
                    },
                    badges: {
                        total: parseInt(badgesCount.rows[0].total)
                    },
                    time: {
                        totalMinutes: Math.round(student.total_time_spent / 60)
                    }
                },
                recentActivity: recentActivity.rows.map(row => ({
                    date: row.activity_date,
                    lessonsCompleted: row.lessons_completed,
                    gamesPlayed: row.games_played,
                    pointsEarned: row.points_earned,
                    timeSpent: row.time_spent
                })),
                subjectProgress: subjectProgress.rows.map(row => ({
                    subject: row.subject,
                    totalLessons: parseInt(row.total_lessons),
                    averageScore: Math.round(parseFloat(row.avg_score))
                }))
            }
        });

    } catch (error) {
        console.error('Dashboard fetch error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch dashboard',
            message: error.message 
        });
    }
});

// Get student leaderboard position
router.get('/leaderboard', authenticateToken, requireStudent, async (req, res) => {
    try {
        const studentId = req.user.userId;
        const { grade, scope = 'school' } = req.query;

        const student = await pool.query(
            'SELECT class_grade, school_name FROM students WHERE user_id = $1',
            [studentId]
        );

        if (student.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Student not found'
            });
        }

        const { class_grade, school_name } = student.rows[0];

        // Build leaderboard query based on scope
        let leaderboardQuery = `
            SELECT 
                s.id,
                s.full_name,
                s.roll_number,
                s.points,
                s.class_grade,
                s.school_name,
                ROW_NUMBER() OVER (ORDER BY s.points DESC) as rank
            FROM students s
            WHERE 1=1
        `;
        const params = [];

        if (scope === 'class') {
            leaderboardQuery += ' AND s.class_grade = $1 AND s.school_name = $2';
            params.push(class_grade, school_name);
        } else if (scope === 'school') {
            leaderboardQuery += ' AND s.school_name = \$1';
            params.push(school_name);
        } else if (scope === 'grade') {
            leaderboardQuery += ' AND s.class_grade = \$1';
            params.push(class_grade);
        }

        leaderboardQuery += ' ORDER BY s.points DESC LIMIT 50';

        const leaderboard = await pool.query(leaderboardQuery, params);

        // Find current student's position
        const myPosition = leaderboard.rows.findIndex(row => row.id === student.rows[0].id);

        res.json({
            success: true,
            data: {
                myRank: myPosition >= 0 ? myPosition + 1 : null,
                myPoints: student.rows[0].points,
                scope,
                leaderboard: leaderboard.rows.map((row, index) => ({
                    rank: index + 1,
                    name: row.full_name,
                    rollNumber: row.roll_number,
                    points: row.points,
                    grade: row.class_grade,
                    school: row.school_name,
                    isMe: row.id === student.rows[0].id
                }))
            }
        });

    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch leaderboard',
            message: error.message 
        });
    }
});

// Change password
router.put('/change-password', authenticateToken, requireStudent, validatePasswordChange, async (req, res) => {
    const bcrypt = require('bcryptjs');
    
    try {
        const studentId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        // Get current password hash
        const userResult = await pool.query(
            'SELECT password_hash FROM users WHERE id = \$1',
            [studentId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'User not found'
            });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
        if (!isValid) {
            return res.status(401).json({ 
                success: false,
                error: 'Current password is incorrect',
                message: 'The current password you entered is incorrect.'
            });
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 12);

        // Update password
        await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
            [newPasswordHash, studentId]
        );

        res.json({
            success: true,
            message: 'Password changed successfully! 🔒'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to change password',
            message: error.message 
        });
    }
});

// Delete account
router.delete('/account', authenticateToken, requireStudent, async (req, res) => {
    const client = await pool.connect();
    
    try {
        const studentId = req.user.userId;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ 
                success: false,
                error: 'Password required',
                message: 'Please provide your password to confirm account deletion.'
            });
        }

        await client.query('BEGIN');

        // Verify password
        const bcrypt = require('bcryptjs');
        const userResult = await client.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [studentId]
        );

        if (userResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ 
                success: false,
                error: 'User not found'
            });
        }

        const isValid = await bcrypt.compare(password, userResult.rows[0].password_hash);
        if (!isValid) {
            await client.query('ROLLBACK');
            return res.status(401).json({ 
                success: false,
                error: 'Incorrect password',
                message: 'The password you entered is incorrect.'
            });
        }

        // Soft delete - deactivate user
        await client.query(
            'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1',
            [studentId]
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Account deleted successfully. We\'re sad to see you go! 👋'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Delete account error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to delete account',
            message: error.message 
        });
    } finally {
        client.release();
    }
});

// Get student badges
router.get('/badges', authenticateToken, requireStudent, async (req, res) => {
    try {
        const studentId = req.user.userId;

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

        // Get earned badges
        const earnedBadges = await pool.query(
            `SELECT b.*, sb.earned_at
             FROM student_badges sb
             JOIN badges b ON sb.badge_id = b.badge_id
             WHERE sb.student_id = $1
             ORDER BY sb.earned_at DESC`,
            [studentDbId]
        );

        // Get all available badges
        const allBadges = await pool.query(
            'SELECT * FROM badges ORDER BY rarity, requirement_value'
        );

        // Calculate progress for locked badges
        const [lessonsCompleted, gamesPlayed, totalPoints] = await Promise.all([
            pool.query(
                'SELECT COUNT(*) FROM student_lessons WHERE student_id = $1 AND completed = true',
                [studentDbId]
            ),
            pool.query(
                'SELECT COUNT(*) FROM student_games WHERE student_id = $1 AND played = true',
                [studentDbId]
            ),
            pool.query(
                'SELECT points FROM students WHERE id = $1',
                [studentDbId]
            )
        ]);

        const progress = {
            lessons_completed: parseInt(lessonsCompleted.rows[0].count),
            games_played: parseInt(gamesPlayed.rows[0].count),
            total_points: totalPoints.rows[0]?.points || 0
        };

        const earnedBadgeIds = new Set(earnedBadges.rows.map(b => b.badge_id));

        const badgesWithStatus = allBadges.rows.map(badge => {
            const isEarned = earnedBadgeIds.has(badge.badge_id);
            const earnedBadge = earnedBadges.rows.find(b => b.badge_id === badge.badge_id);
            
            let currentProgress = 0;
            if (badge.requirement_type === 'lessons_completed') {
                currentProgress = progress.lessons_completed;
            } else if (badge.requirement_type === 'games_played') {
                currentProgress = progress.games_played;
            } else if (badge.requirement_type === 'total_points') {
                currentProgress = progress.total_points;
            }

            return {
                badgeId: badge.badge_id,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                rarity: badge.rarity,
                requirementType: badge.requirement_type,
                requirementValue: badge.requirement_value,
                isEarned,
                earnedAt: earnedBadge?.earned_at || null,
                progress: {
                    current: currentProgress,
                    required: badge.requirement_value,
                    percentage: Math.min(100, Math.round((currentProgress / badge.requirement_value) * 100))
                }
            };
        });

        // Group by rarity
        const groupedBadges = {
            common: badgesWithStatus.filter(b => b.rarity === 'common'),
            rare: badgesWithStatus.filter(b => b.rarity === 'rare'),
            epic: badgesWithStatus.filter(b => b.rarity === 'epic'),
            legendary: badgesWithStatus.filter(b => b.rarity === 'legendary')
        };

        res.json({
            success: true,
            data: {
                earned: earnedBadges.rows.length,
                total: allBadges.rows.length,
                badges: badgesWithStatus,
                grouped: groupedBadges
            }
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

// Update streak (called daily on first activity)
router.post('/streak/update', authenticateToken, requireStudent, async (req, res) => {
    try {
        const studentId = req.user.userId;

        const studentResult = await pool.query(
            'SELECT id, last_activity, streak FROM students WHERE user_id = $1',
            [studentId]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Student not found'
            });
        }

        const student = studentResult.rows[0];
        const lastActivity = new Date(student.last_activity);
        const today = new Date();
        const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

        let newStreak = student.streak;

        if (daysDiff === 0) {
            // Same day, no change
            return res.json({
                success: true,
                message: 'Streak maintained',
                streak: newStreak
            });
        } else if (daysDiff === 1) {
            // Consecutive day, increment streak
            newStreak += 1;
        } else {
            // Streak broken, reset to 1
            newStreak = 1;
        }

        await pool.query(
            'UPDATE students SET streak = $1, last_activity = NOW() WHERE id = $2',
            [newStreak, student.id]
        );

        res.json({
            success: true,
            message: daysDiff === 1 ? '🔥 Streak increased!' : '🔄 Streak reset',
            streak: newStreak,
            increased: daysDiff === 1
        });

    } catch (error) {
        console.error('Streak update error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update streak',
            message: error.message 
        });
    }
});

module.exports = router;
