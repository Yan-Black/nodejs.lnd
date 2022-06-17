const { v4: uuidv4 } = require('uuid');
const { generate: generatePassword } = require('generate-password');
const {
  uniqueNamesGenerator: generateLogin,
  names
} = require('unique-names-generator');

const getRandomAge = () => Math.ceil(Math.random() * 10 + 20);

module.exports = new Array(10).fill(null).map(() => ({
  id: uuidv4(),
  login: generateLogin({ dictionaries: [names] }),
  password: generatePassword({ length: 8, numbers: true }),
  age: getRandomAge(),
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}));
