const { v4: uuidv4 } = require('uuid');
const { generate } = require('generate-password');
const { uniqueNamesGenerator, names } = require('unique-names-generator');

const getRandomAge = () => Math.ceil(Math.random() * 10 + 20);

module.exports = new Array(10).fill(null).map(() => ({
  id: uuidv4(),
  login: uniqueNamesGenerator({ dictionaries: [names] }),
  password: generate({ length: 8, numbers: true }),
  age: getRandomAge(),
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}));
