import {Router} from 'express'
import Mensajes from '../persistencia/mensajesManager.js'

const router = Router()

const mensajes = new Mensajes()

router.post('/',async (req,res)=>{
    const obj = req.body
    const  mensCreate = await mensajes.createMensaje(obj)
    res.json({message: 'mensaje guardado', mensCreate})
})



export default router