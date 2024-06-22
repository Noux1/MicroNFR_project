import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5435'),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialectOptions: {
    ssl: false // Ensure SSL is disabled
  }
});

async function connectToDatabase() {
  try {
    // Authenticate and establish the database connection
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Synchronize models with the database
    await sequelize.sync({ force: false });
    console.log('Database synchronized.');

    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

export { sequelize, connectToDatabase };


