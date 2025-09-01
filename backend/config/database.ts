const { Sequelize } = require('sequelize');
require('dotenv').config({ path: require('path').join(__dirname, '../config.env') });

// Use environment variables with fallbacks
const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'peer_share_db',
  username: process.env.DB_USER || 'peer_share',
  password: process.env.DB_PASSWORD || 'mySecurePass123',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: process.env.DB_DIALECT || 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = { sequelize };