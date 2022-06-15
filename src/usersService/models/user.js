import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      login: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      age: {
        type: DataTypes.INTEGER
      },
      isDeleted: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      sequelize,
      modelName: 'User',
      paranoid: true,
      deletedAt: 'deletedAt',
      timestamps: true
    }
  );

  return User;
};
