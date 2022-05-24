import express from 'express';
import { usersList } from './usersList';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/users', (req, res) => {
  const { body } = req;
  const list = usersList.getAutoSuggestUsers(body.loginSubstring, body.limit);

  if (list) {
    res.json(list);
  } else {
    res.status(400).end();
  }
});

router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = usersList.getUserById(id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).send(`no user found by specified id ${id}`);
  }
});

router.post('/users', (req, res) => {
  const { body: userInfo } = req;

  const userId = uuidv4();
  userInfo.id = userId;
  usersList.createUser(userInfo);

  res.json({ id: userId });
});

router.put('/users', (req, res) => {
  const { body: userInfo } = req;

  usersList
    .updateUser(userInfo)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).send(`no user found with id ${userInfo.id}`);
    });
});

router.delete('/users', (req, res) => {
  const { body: userInfo } = req;

  usersList
    .softDeleteUser(userInfo)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).send(`no user found with id ${userInfo.id}`);
    });
});

export { router };
