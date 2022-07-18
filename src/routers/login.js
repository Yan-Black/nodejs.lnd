import express from 'express';
import LoginController from '../controllers/login';

const loginRouter = express.Router();

loginRouter.post('/', LoginController.getJWT);

export { loginRouter };
