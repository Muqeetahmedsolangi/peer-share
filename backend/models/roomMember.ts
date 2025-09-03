const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const { Room } = require('./room');

class RoomMember extends Model {
  public id!: number;
  public roomId!: number;
  public userId!: any[]; // JSON array of user IDs
  public joinedAt!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;
}

const initRoomMember = () => {
  RoomMember.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    roomId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.JSON, allowNull: false, defaultValue: [] }, // JSON field
    joinedAt: { type: DataTypes.DATE, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false }
  }, { sequelize, modelName: 'RoomMember' });

  RoomMember.belongsTo(Room, { foreignKey: 'roomId' });
  Room.hasMany(RoomMember, { foreignKey: 'roomId' });
};

module.exports = { initRoomMember, RoomMember };