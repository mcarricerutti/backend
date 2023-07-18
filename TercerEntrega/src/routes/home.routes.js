import {Router} from 'express';
// import userModel from '../persistencia/mongoDB/models/users.model.js';
// import {createHash, validatePassword} from '../utils/bcript.js';
// import { get } from 'mongoose';

const homeRouter = Router(); 

homeRouter.get('/', async (req,res)=>{
    if (!req.session.user) {
        res.redirect("/api/sessions/login");
    }
    else{
        res.render('home',{user:req.session.user})
    }
})

export default homeRouter;