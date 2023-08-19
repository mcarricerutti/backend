import { Router } from "express";
import { getChat } from "../controllers/chat.controller.js";
import authz from "../middlewares/autorization.js";

const chatRouter = Router();

chatRouter.get('/', authz('user'), getChat);

export default chatRouter;