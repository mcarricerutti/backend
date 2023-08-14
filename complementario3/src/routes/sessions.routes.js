import {Router} from 'express';
import { renderRegister, tryRegister,failregister, logout, login, tryLogin, faillogin, profile, currentUser, resetPasswordView, resetPasswordEmail } from '../controllers/sessions.controller.js';
import passport from 'passport';
import autorization from '../middlewares/autorization.js';

const sessionRouter = Router(); 

// -------------------------------------------------Login sin Passport -----------------------------------------------
//Ruta api/sessions
sessionRouter.get('/register', renderRegister);
sessionRouter.get('/resetpasswordview', resetPasswordView);
sessionRouter.post('/resetpasswordemail', resetPasswordEmail);


//Ruta api/sessions/tryregister
//sessionRouter.post('/api/sessions/tryregister', tryRegister);

//logout
sessionRouter.get('/logout', logout);

//Login
sessionRouter.get('/login', login);

//Try login
//sessionRouter.post('/trylogin', tryLogin);

//Profile
sessionRouter.get('/profile', profile);

// -------------------------------------------------Login con Passport -----------------------------------------------
//Ruta api/sessions
sessionRouter.post('/tryregister', passport.authenticate('register',{failureRedirect:'failregister'}),tryRegister);
sessionRouter.get('/failregister', failregister);

//Try login
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