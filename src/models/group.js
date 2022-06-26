import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Group extends Model {}

  Group.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: DataTypes.STRING,
      permission: DataTypes.STRING
    },
    {
      sequelize,
      timestamps: false
    }
  );

  return Group;
};
