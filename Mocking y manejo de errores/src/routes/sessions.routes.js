import { Router } from "express";
import { destroySession, current, resetPasswordEmail} from "../controllers/session.controller.js";
import {auth} from '../middlewares/auth.js'
import passport from "passport";

const sessionsRouter = new Router();

sessionsRouter.post('/resetpasswordemail', resetPasswordEmail);

sessionsRouter.post(
  "/signup",
  passport.authenticate("register", {
    failureRedirect: "/errorSignup",
    successRedirect: "/",
  })
);

sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/errorLogin",
    successRedirect: "/products",
  })
);

sessionsRouter.get("/logout", destroySession);

// Passport con github
sessionsRouter.get("/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

sessionsRouter.get("/github/callback", passport.authenticate("github", {
    failureRedirect: "/",
    successRedirect: "/products",
}));

sessionsRouter.get("/current",auth, current);

export default sessionsRouter;
