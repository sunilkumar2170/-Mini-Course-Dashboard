// models/Reply.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Post = require("./Post");

const Reply = sequelize.define("Reply", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    defaultValue: "Anonymous",
  },
});

Post.hasMany(Reply, { onDelete: "CASCADE" });
Reply.belongsTo(Post);

module.exports = Reply;
