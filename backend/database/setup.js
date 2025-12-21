// backend/database/setup.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const { pool } = require('../config/database');

const createTables = async () => {
    const client = await pool.connect();
    
    try {
        console.log('🚀 Creating database tables...');

        // Start transaction for atomic operations
        await client.query('BEGIN');

        // Enable UUID extension
        await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        // Users table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                user_type VARCHAR(20) DEFAULT 'student' CHECK (user_type IN ('student', 'teacher', 'admin')),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Students table
        await client.query(`
            CREATE TABLE IF NOT EXISTS students (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                roll_number VARCHAR(50) UNIQUE NOT NULL,
                full_name VARCHAR(255) NOT NULL CHECK (LENGTH(full_name) >= 2),
                class_grade INTEGER NOT NULL CHECK (class_grade BETWEEN 1 AND 12),
                school_name VARCHAR(255) NOT NULL CHECK (LENGTH(school_name) >= 3),
                preferred_language VARCHAR(10) DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'bn', 'te', 'gu')),
                points INTEGER DEFAULT 0 CHECK (points >= 0),
                streak INTEGER DEFAULT 0 CHECK (streak >= 0),
                total_time_spent INTEGER DEFAULT 0 CHECK (total_time_spent >= 0),
                login_time TIMESTAMP,
                last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Teachers table (NEW - for teacher portal)
        await client.query(`
            CREATE TABLE IF NOT EXISTS teachers (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                employee_id VARCHAR(50) UNIQUE NOT NULL,
                full_name VARCHAR(255) NOT NULL CHECK (LENGTH(full_name) >= 2),
                school_name VARCHAR(255) NOT NULL CHECK (LENGTH(school_name) >= 3),
                subjects TEXT[], -- Array of subjects they teach
                classes_taught INTEGER[], -- Array of grades they teach
                phone VARCHAR(15),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Lessons table
        await client.query(`
            CREATE TABLE IF NOT EXISTS lessons (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                lesson_id VARCHAR(100) UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                subject VARCHAR(50) NOT NULL CHECK (subject IN ('math', 'science', 'english', 'hindi', 'social')),
                grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 12),
                duration INTEGER DEFAULT 30 CHECK (duration > 0),
                points_reward INTEGER DEFAULT 10 CHECK (points_reward > 0),
                difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
                content_url TEXT, -- Link to lesson content
                thumbnail_url TEXT, -- Lesson thumbnail
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Games table
        await client.query(`
            CREATE TABLE IF NOT EXISTS games (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                game_id VARCHAR(100) UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                subject VARCHAR(50) NOT NULL CHECK (subject IN ('math', 'science', 'english', 'hindi', 'social')),
                grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 12),
                difficulty VARCHAR(20) DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
                points_reward INTEGER DEFAULT 15 CHECK (points_reward > 0),
                icon VARCHAR(10) DEFAULT '🎮',
                game_url TEXT, -- Link to game
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Student lessons progress
        await client.query(`
            CREATE TABLE IF NOT EXISTS student_lessons (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                student_id UUID REFERENCES students(id) ON DELETE CASCADE,
                lesson_id VARCHAR(100) NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                score INTEGER CHECK (score >= 0 AND score <= 100),
                time_spent INTEGER DEFAULT 0 CHECK (time_spent >= 0),
                attempts INTEGER DEFAULT 1 CHECK (attempts > 0),
                completed_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(student_id, lesson_id)
            )
        `);

        // Student games progress
        await client.query(`
            CREATE TABLE IF NOT EXISTS student_games (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                student_id UUID REFERENCES students(id) ON DELETE CASCADE,
                game_id VARCHAR(100) NOT NULL,
                played BOOLEAN DEFAULT FALSE,
                high_score INTEGER DEFAULT 0 CHECK (high_score >= 0),
                last_score INTEGER CHECK (last_score >= 0),
                time_spent INTEGER DEFAULT 0 CHECK (time_spent >= 0),
                times_played INTEGER DEFAULT 0 CHECK (times_played >= 0),
                played_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(student_id, game_id)
            )
        `);

        // Badges table
        await client.query(`
            CREATE TABLE IF NOT EXISTS badges (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                badge_id VARCHAR(100) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                icon VARCHAR(10) DEFAULT '🏆',
                requirement_type VARCHAR(50) NOT NULL,
                requirement_value INTEGER NOT NULL,
                rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Student badges
        await client.query(`
            CREATE TABLE IF NOT EXISTS student_badges (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                student_id UUID REFERENCES students(id) ON DELETE CASCADE,
                badge_id VARCHAR(100) NOT NULL,
                earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(student_id, badge_id)
            )
        `);

        // Daily activity log (NEW - for streak tracking)
        await client.query(`
            CREATE TABLE IF NOT EXISTS daily_activity (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                student_id UUID REFERENCES students(id) ON DELETE CASCADE,
                activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
                lessons_completed INTEGER DEFAULT 0,
                games_played INTEGER DEFAULT 0,
                points_earned INTEGER DEFAULT 0,
                time_spent INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(student_id, activity_date)
            )
        `);

        // Create indexes for performance
        console.log('📊 Creating indexes...');
        
        await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_students_roll_number ON students(roll_number)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_students_class_grade ON students(class_grade)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_teachers_employee_id ON teachers(employee_id)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_lessons_subject_grade ON lessons(subject, grade)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_lessons_active ON lessons(is_active)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_games_subject_grade ON games(subject, grade)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_games_active ON games(is_active)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_student_lessons_student ON student_lessons(student_id)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_student_lessons_completed ON student_lessons(completed)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_student_games_student ON student_games(student_id)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_daily_activity_student_date ON daily_activity(student_id, activity_date)');

        // Create trigger for updating updated_at timestamp
        await client.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        const tables = ['users', 'students', 'teachers', 'lessons', 'games', 'student_lessons', 'student_games'];
        for (const table of tables) {
            await client.query(`
                DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
                CREATE TRIGGER update_${table}_updated_at
                BEFORE UPDATE ON ${table}
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
            `);
        }

        await client.query('COMMIT');
        console.log('✅ All tables and indexes created successfully!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error creating tables:', error);
        throw error;
    } finally {
        client.release();
    }
};

const dropAllTables = async () => {
    const client = await pool.connect();
    
    try {
        console.log('🗑️  Dropping all tables...');
        
        await client.query('DROP TABLE IF EXISTS student_badges CASCADE');
        await client.query('DROP TABLE IF EXISTS badges CASCADE');
        await client.query('DROP TABLE IF EXISTS daily_activity CASCADE');
        await client.query('DROP TABLE IF EXISTS student_games CASCADE');
        await client.query('DROP TABLE IF EXISTS student_lessons CASCADE');
        await client.query('DROP TABLE IF EXISTS games CASCADE');
        await client.query('DROP TABLE IF EXISTS lessons CASCADE');
        await client.query('DROP TABLE IF EXISTS teachers CASCADE');
        await client.query('DROP TABLE IF EXISTS students CASCADE');
        await client.query('DROP TABLE IF EXISTS users CASCADE');
        
        console.log('✅ All tables dropped successfully!');
    } catch (error) {
        console.error('❌ Error dropping tables:', error);
        throw error;
    } finally {
        client.release();
    }
};

const runSetup = async () => {
    try {
        await createTables();
        console.log('🎉 Database setup completed!');
        process.exit(0);
    } catch (error) {
        console.error('💥 Database setup failed:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    runSetup();
}

module.exports = { createTables, dropAllTables };
