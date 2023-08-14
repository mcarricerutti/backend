import { Router } from 'express';
import { getMockUsers, getUserById, getUsers, resetPassword, resetPasswordNewPass, setPasswordModifiable, changePremiumRole } from '../controllers/user.controller.js';
import { set } from 'mongoose';


const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/mockusers', getMockUsers);

userRouter.get('/:id', getUserById);

userRouter.get('/:id/resetpasswordnewpass', resetPasswordNewPass)
userRouter.post('/:id/resetpassword', resetPassword)

userRouter.get('/:id/setpasswordmodifiable', setPasswordModifiable)

userRouter.get('/premium/:id', changePremiumRole)



export default userRouter;