import { sequelize } from './models/index.js';

async function initDB() {
  try {
    // Drop and recreate all tables
    await sequelize.sync({ force: true });
    console.log('Database tables recreated successfully');
  } catch (error) {
    console.error('Error recreating database tables:', error);
    throw error;
  }
}

export default initDB;
