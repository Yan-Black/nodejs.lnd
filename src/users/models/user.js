import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      login: DataTypes.STRING,
      password: DataTypes.STRING,
      age: DataTypes.INTEGER
    },
    {
      sequelize,
      paranoid: true,
      deletedAt: 'deletedAt',
      timestamps: true
    }
  );

  return User;
};
