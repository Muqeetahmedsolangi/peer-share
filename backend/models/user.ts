const { DataTypes, Model } = require('sequelize');

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public authProvider!: string;
}

const initUser = (sequelize: any) => {
  User.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    authProvider: { type: DataTypes.STRING, allowNull: false }
  }, { sequelize, modelName: 'User' });
};

module.exports = { initUser, User };