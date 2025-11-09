// models/User.js
const { DataTypes } = require('sequelize');
const path = require('path');

// Use path.join() to handle spaces or dashes in folder names
const sequelize = require(path.join(__dirname, '../config/db'));

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
  },
  otp_expiry: {
    type: DataTypes.DATE,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
