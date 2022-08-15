import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsToMany(models.User, {
        through: models.UserGroup,
        onDelete: 'CASCADE',
        as: {
          plural: 'users',
          singular: 'user'
        }
      });
    }
  }

  Group.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: DataTypes.STRING,
      permissions: DataTypes.ARRAY(DataTypes.STRING)
    },
    {
      sequelize,
      modelName: Group.name,
      timestamps: false
    }
  );

  return Group;
};
