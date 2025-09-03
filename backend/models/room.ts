const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('./user');

class Room extends Model {
  public id!: number;
  public name!: string;
  public code!: string;
  public createdBy!: number;
}

const initRoom = () => {
  Room.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    createdBy: { type: DataTypes.INTEGER, allowNull: false }
  }, { sequelize, modelName: 'Room' });

  Room.belongsTo(User, { foreignKey: 'createdBy' });
  User.hasMany(Room, { foreignKey: 'createdBy' });
};

module.exports = { initRoom, Room };