import { Router } from 'express';
import { resetPassword, resetPasswordNewPass} from '../controllers/views.controller.js';
import setPasswordModifiable from "../controllers/views.controller.js"

const userRouter = Router();

userRouter.get('/:id/resetpasswordnewpass', resetPasswordNewPass)

userRouter.post('/:id/resetpassword', resetPassword)

userRouter.get('/:id/setpasswordmodifiable', setPasswordModifiable)

export default userRouter;