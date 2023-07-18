import {Router} from 'express';
import { renderRegister, tryRegister,failregister, logout, login, tryLogin, faillogin, profile, currentUser } from '../controllers/sessions.controller.js';
import passport from 'passport';
import autorization from '../middlewares/auth.js'

const sessionRouter = Router(); 

//Login sin Passport

sessionRouter.get('/register', renderRegister);

sessionRouter.get('/logout', logout);

sessionRouter.get('/login', login);

sessionRouter.get('/profile', profile);

//Login con Passport
sessionRouter.post('/tryregister', passport.authenticate('register',{failureRedirect:'failregister'}),tryRegister);
sessionRouter.get('/failregister', failregister);

sessionRouter.post('/trylogin',passport.authenticate('login',{failureRedirect:'faillogin'}), tryLogin);
sessionRouter.get('/faillogin', faillogin);

// github
sessionRouter.get('/google', passport.authenticate('google',{scope:['email','profile']}),async (req,res)=>{});
sessionRouter.get('/googlecallback', 
    passport.authenticate('google',{failureRedirect:'/faillogin'}),
    async (req,res)=>{
    req.session.user = req.user;
    res.redirect('../products');
});

// Google
sessionRouter.get('/github', passport.authenticate('github',{scope:['user:email']}),async (req,res)=>{});

sessionRouter.get('/githubcallback', 
    passport.authenticate('github',{failureRedirect:'/faillogin'}),
    async (req,res)=>{
    req.session.user = req.user;
    res.redirect('../products');
});

//Current user
sessionRouter.get('/current',autorization('user'), currentUser);

export default sessionRouter;