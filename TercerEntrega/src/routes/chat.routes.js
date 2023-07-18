import { Router } from "express";
import { getChat } from "../controllers/chat.controller.js";
import autorization from '../middlewares/auth.js'

const chatRouter = Router();

chatRouter.get('/',autorization('user'), getChat);

export default chatRouter;