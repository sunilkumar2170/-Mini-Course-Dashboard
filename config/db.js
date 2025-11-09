// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a Sequelize instance (connection)
const sequelize = new Sequelize(
  process.env.DB_NAME,  // Database name
  process.env.DB_USER,  // Username
  process.env.DB_PASS,  // Password
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres', // Change this if you use mysql/mariadb/sqlite
    logging: false, 
  }
);


sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully!'))
  .catch((err) => console.error('❌ Database connection error:', err));

module.exports = sequelize;
