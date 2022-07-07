import { Model } from 'sequelize';

export default (sequelize) => {
  class UserGroup extends Model {
    static associate() {}
  }

  UserGroup.init(
    {},
    { sequelize, timestamps: false, modelName: UserGroup.name }
  );

  return UserGroup;
};
