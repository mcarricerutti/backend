import { Router } from "express";
import { getChat } from "../controllers/chat.controller.js";
import autorization from "../middlewares/autorization.js";

const chatRouter = Router(); //Router para manejo de rutas

chatRouter.get('/', autorization('user'), getChat);

export default chatRouter;