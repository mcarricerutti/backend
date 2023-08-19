import { Router } from "express"
import { findById, updateRole } from "../services/users.service.js";

const usersRouter = new Router();

usersRouter.put('/premium/:uid', async(req,res,next)=>{
    try {
        const {uid} = req.params
        // busca el usuario segun el uid
        const user = await findById(uid)

        // error si no existe
        if(!user) {
            return res.status(400).json({error: 'Wrong User Id'})
        }

        // chequear el rol, si es user pasarlo a premium y viceversa
        if(user.role === "user"){
            await updateRole(uid,'premium')
            return res.status(200).send('Role changed successfully')
        }

        if(user.role === "premium") {
            await updateRole(uid,'user')
            return res.status(200).send('Role changed successfully')
        }
        
        // si no era ni user ni premium error
        return res.status(400).send('Cannot change the role')
    } catch (error) {
        console.log(error);
    }
})

export default usersRouter;