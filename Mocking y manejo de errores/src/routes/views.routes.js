import { Router } from "express";
import { login, signUp, profile, products, errorLogin, errorSignUp, cart , aggProd} from "../controllers/views.controller.js";
import { resetPasswordView } from "../controllers/session.controller.js";
import { auth, authAdmin, authUser } from "../middlewares/auth.js";

const viewsRouter = new Router()

viewsRouter.get('/', login)
viewsRouter.get('/resetpasswordview', resetPasswordView);
viewsRouter.get('/signup', signUp)
viewsRouter.get('/profile', auth, profile)
viewsRouter.get('/products', auth, products)
viewsRouter.get('/errorLogin', errorLogin)
viewsRouter.get("/errorSignup", errorSignUp)
viewsRouter.get('/cart', authUser, cart)
viewsRouter.get('/agregarProd', authAdmin, aggProd)


export default viewsRouter;