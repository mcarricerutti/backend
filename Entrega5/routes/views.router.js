import {Router}  from 'express'
import { products } from '../app.js';

const router = Router()

router.get("/",(req,res)=>{
    res.render('index',{products})
})

router.get('/realtimeproducts',async(req,res)=>{
    res.render('realTimeProducts',{products})
})



export default router