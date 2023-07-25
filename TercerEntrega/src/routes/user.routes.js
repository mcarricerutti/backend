import { Router } from 'express';
import { getMockUsers, getUserById, getUsers } from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/mockusers', getMockUsers);

userRouter.get('/:id', getUserById);

export default userRouter;