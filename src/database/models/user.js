import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Group, {
        through: models.UserGroup,
        onDelete: 'CASCADE'
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
      timestamps: true
    }
  );

  return User;
};
