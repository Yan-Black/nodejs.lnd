/* eslint-disable no-param-reassign */
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Group, {
        through: models.UserGroup,
        onDelete: 'CASCADE',
        hooks: true,
        as: {
          plural: 'groups',
          singular: 'group'
        }
      });
    }
  }

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
      modelName: User.name,
      timestamps: true,
      hooks: {
        afterCreate(record) {
          delete record.dataValues.updatedAt;
          delete record.dataValues.createdAt;
          delete record.dataValues.deletedAt;
        }
      }
    }
  );

  return User;
};
