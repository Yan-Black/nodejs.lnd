import express from 'express';
import { usersList } from './usersList';
import { v4 as uuidv4 } from 'uuid';
import { userBodyValidationMiddleware } from '../task2.2/userBodyValidationMiddleware';

const noUserFoundMessage = (id) => `no user found by id {${id}}`;

const router = express.Router();

router.get(
  '/users/getAutoSuggestUsers',
  (req, res, next) => {
    const { query } = req;
    const { loginSubstring, limit } = query;

    if (!loginSubstring || !Number(limit)) {
      res.status(400).end();
    } else {
      next();
    }
  },
  (req, res) => {
    const { query } = req;
    const { loginSubstring, limit } = query;

    const list = usersList.getAutoSuggestUsers(loginSubstring, limit);

    if (list) {
      res.json(list);
    } else {
      res.status(400).end();
    }
  }
);

router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = usersList.getUserById(id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).send(noUserFoundMessage(id));
  }
});

router.post('/users', userBodyValidationMiddleware, (req, res) => {
  const { body: userInfo } = req;

  const userId = uuidv4();
  userInfo.id = userId;
  usersList.createUser(userInfo);

  res.json({ id: userId });
});

router.put('/users', userBodyValidationMiddleware, (req, res) => {
  const { body: userInfo } = req;

  usersList
    .updateUser(userInfo)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).send(noUserFoundMessage(userInfo.id));
    });
});

router.delete('/users', (req, res) => {
  const { body } = req;

  usersList
    .softDeleteUser(body.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).send(noUserFoundMessage(body.id));
    });
});

export { router };
