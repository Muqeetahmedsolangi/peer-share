const { DataTypes, Model } = require('sequelize');

class Room extends Model {
  public id!: number;
  public code!: string;
  public createdBy!: number; // User ID
}

const initRoom = (sequelize: any) => {
  Room.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    createdBy: { type: DataTypes.INTEGER, allowNull: false }
  }, { sequelize, modelName: 'Room' });
};

module.exports = { initRoom, Room };
