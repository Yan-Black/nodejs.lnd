import mockData from '../model/mockData';

export const fillWithPredifinedDataIfEmpty = async (db) => {
  const users = await db.user.findAll();

  if (!users.length) {
    mockData.forEach((userData) => {
      db.user.create(userData);
    });
  }
};
