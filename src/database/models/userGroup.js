import { Model } from 'sequelize';

export default (sequelize, DataTypes, User, Group) => {
  class UserGroup extends Model {}

  UserGroup.init(
    {
      userId: {
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'id'
        }
      },
      groupId: {
        type: DataTypes.UUID,
        references: {
          model: Group,
          key: 'id'
        }
      }
    },
    { sequelize, timestamps: false }
  );

  return UserGroup;
};
