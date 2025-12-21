// backend/database/seed.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
    const client = await pool.connect();
    
    try {
        console.log('🌱 Seeding database with sample data...');

        await client.query('BEGIN');

        // Seed demo users
        const hashedPassword = await bcrypt.hash('demo123', 10);
        
        const studentUserResult = await client.query(`
            INSERT INTO users (email, password_hash, user_type) 
            VALUES ($1, $2, $3)
            ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
            RETURNING id
        `, ['student@demo.com', hashedPassword, 'student']);

        const teacherUserResult = await client.query(`
            INSERT INTO users (email, password_hash, user_type) 
            VALUES ($1, $2, $3)
            ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
            RETURNING id
        `, ['teacher@demo.com', hashedPassword, 'teacher']);

        const studentUserId = studentUserResult.rows[0].id;
        const teacherUserId = teacherUserResult.rows[0].id;

        // Seed demo student
        await client.query(`
            INSERT INTO students (user_id, roll_number, full_name, class_grade, school_name, points, streak) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (roll_number) DO NOTHING
        `, [studentUserId, 'STU2024001', 'Demo Student', 8, 'Demo School', 150, 5]);

        // Seed demo teacher
        await client.query(`
            INSERT INTO teachers (user_id, employee_id, full_name, school_name, subjects, classes_taught) 
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (employee_id) DO NOTHING
        `, [teacherUserId, 'TCH2024001', 'Demo Teacher', 'Demo School', ['math', 'science'], [7, 8, 9]]);

        // Seed lessons
        const lessons = [
            ['math_rational_numbers', 'Rational Numbers', 'Learn about rational numbers, their properties and operations', 'math', 8, 45, 30, 'medium'],
            ['math_linear_equations', 'Linear Equations', 'Solve linear equations in one variable', 'math', 8, 40, 25, 'medium'],
            ['math_quadratic_equations', 'Quadratic Equations', 'Master solving quadratic equations', 'math', 8, 50, 35, 'hard'],
            ['science_cell_structure', 'Cell Structure and Function', 'Explore the basic unit of life - cells and their components', 'science', 8, 50, 35, 'medium'],
            ['science_microorganisms', 'Microorganisms: Friend and Foe', 'Learn about beneficial and harmful microorganisms', 'science', 8, 45, 30, 'easy'],
            ['science_force_pressure', 'Force and Pressure', 'Understand the concepts of force and pressure', 'science', 8, 40, 30, 'medium'],
            ['english_grammar_basics', 'Grammar Fundamentals', 'Master the basics of English grammar and sentence structure', 'english', 8, 40, 25, 'easy'],
            ['english_honeydew_1', 'The Best Christmas Present', 'A heartwarming story about war, peace, and human connection', 'english', 8, 35, 20, 'easy'],
            ['english_comprehension', 'Reading Comprehension', 'Improve your reading and understanding skills', 'english', 8, 45, 30, 'medium'],
            ['hindi_kavita', 'Hindi Poetry', 'Explore beautiful Hindi poems and their meanings', 'hindi', 8, 35, 25, 'easy'],
            ['hindi_vasant_1', 'ध्वनि (कविता)', 'सूर्यकांत त्रिपाठी निराला की प्रेरणादायक कविता', 'hindi', 8, 30, 20, 'easy'],
            ['hindi_grammar', 'Hindi Grammar', 'व्याकरण के मूल सिद्धांत सीखें', 'hindi', 8, 40, 25, 'medium'],
            ['social_history_ancient', 'Ancient Indian History', 'Journey through ancient Indian civilizations and cultures', 'social', 8, 60, 40, 'medium'],
            ['social_constitution', 'The Indian Constitution', 'Understanding the supreme law of India', 'social', 8, 50, 35, 'medium'],
            ['social_geography', 'Geography of India', 'Learn about India\'s diverse geography', 'social', 8, 45, 30, 'easy']
        ];

        for (const lesson of lessons) {
            await client.query(`
                INSERT INTO lessons (lesson_id, title, description, subject, grade, duration, points_reward, difficulty) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                ON CONFLICT (lesson_id) DO NOTHING
            `, lesson);
        }

        console.log(`✅ Seeded ${lessons.length} lessons`);

        // Seed games
        const games = [
            ['math_quiz_8', 'Math Space Adventure', 'Navigate your spaceship through space by solving algebra problems!', 'math', 8, 'medium', 25, '🚀'],
            ['math_puzzle_8', 'Number Puzzle Master', 'Solve challenging number puzzles and patterns', 'math', 8, 'hard', 30, '🧩'],
            ['science_experiment_8', 'Light Reflection Physics', 'Learn about light reflection by directing laser beams with mirrors!', 'science', 8, 'hard', 35, '💡'],
            ['science_lab_8', 'Virtual Science Lab', 'Conduct virtual experiments safely', 'science', 8, 'medium', 25, '🔬'],
            ['english_word_game_8', 'Word Builder Game', 'Build your vocabulary with fun word games', 'english', 8, 'easy', 20, '📝'],
            ['english_story_8', 'Story Adventure', 'Create your own story adventure', 'english', 8, 'medium', 25, '📖'],
            ['hindi_story_game_8', 'Hindi Story Adventure', 'Interactive stories in Hindi', 'hindi', 8, 'medium', 25, '📚'],
            ['hindi_vocab_8', 'Hindi Vocabulary Builder', 'शब्दावली बढ़ाने का मज़ेदार खेल', 'hindi', 8, 'easy', 20, '✍️'],
            ['social_history_game_8', 'History Timeline Game', 'Explore historical events through games', 'social', 8, 'medium', 30, '🏛️'],
            ['social_map_game_8', 'Geography Map Quest', 'Master world geography through exploration', 'social', 8, 'easy', 20, '🗺️']
        ];

        for (const game of games) {
            await client.query(`
                INSERT INTO games (game_id, title, description, subject, grade, difficulty, points_reward, icon) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                ON CONFLICT (game_id) DO NOTHING
            `, game);
        }

        console.log(`✅ Seeded ${games.length} games`);

        // Seed badges
        const badges = [
            ['first_lesson', 'First Steps', 'Complete your first lesson', '🎯', 'lessons_completed', 1, 'common'],
            ['point_collector', 'Point Collector', 'Earn 100 points', '⭐', 'total_points', 100, 'common'],
            ['dedicated_learner', 'Dedicated Learner', 'Complete 10 lessons', '📚', 'lessons_completed', 10, 'rare'],
            ['game_master', 'Game Master', 'Play 5 games', '🎮', 'games_played', 5, 'common'],
            ['math_wizard', 'Math Wizard', 'Complete 5 math lessons', '🧙‍♂️', 'subject_lessons', 5, 'rare'],
            ['science_explorer', 'Science Explorer', 'Complete 3 science lessons', '🔭', 'subject_lessons', 3, 'common'],
            ['language_expert', 'Language Expert', 'Complete 5 language lessons', '🗣️', 'subject_lessons', 5, 'rare'],
            ['streak_champion', 'Streak Champion', 'Maintain a 7-day streak', '🔥', 'streak', 7, 'epic'],
            ['perfectionist', 'Perfectionist', 'Score 100% in 3 lessons', '💯', 'perfect_scores', 3, 'epic'],
            ['early_bird', 'Early Bird', 'Complete a lesson before 9 AM', '🌅', 'early_completion', 1, 'rare'],
            ['night_owl', 'Night Owl', 'Complete a lesson after 9 PM', '🦉', 'late_completion', 1, 'rare'],
            ['speed_demon', 'Speed Demon', 'Complete a lesson in under 15 minutes', '⚡', 'speed_completion', 1, 'epic'],
            ['master_learner', 'Master Learner', 'Complete 50 lessons', '👑', 'lessons_completed', 50, 'legendary'],
            ['point_legend', 'Point Legend', 'Earn 1000 points', '💎', 'total_points', 1000, 'legendary']
        ];

        for (const badge of badges) {
            await client.query(`
                INSERT INTO badges (badge_id, name, description, icon, requirement_type, requirement_value, rarity) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) 
                ON CONFLICT (badge_id) DO NOTHING
            `, badge);
        }

        console.log(`✅ Seeded ${badges.length} badges`);

        await client.query('COMMIT');
        console.log('✅ Database seeded successfully!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        client.release();
    }
};

const runSeed = async () => {
    try {
        await seedDatabase();
        console.log('🎉 Database seeding completed!');
        console.log('\n📝 Demo Credentials:');
        console.log('Student - Email: student@demo.com | Password: demo123');
        console.log('Teacher - Email: teacher@demo.com | Password: demo123\n');
        process.exit(0);
    } catch (error) {
        console.error('💥 Database seeding failed:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    runSeed();
}

module.exports = { seedDatabase };
