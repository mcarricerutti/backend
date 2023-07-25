import { Router } from "express";
import {authUser} from '../middlewares/auth.js'

const chatRouter = Router()

chatRouter.get('/', authUser, (req, res, next) => {

    res.render('chat', {
        title: 'Chat comunitario'
    })
})

export default chatRouter