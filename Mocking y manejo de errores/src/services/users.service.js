import {usersManager} from '../persistencia/DAOs/MongoDAOs/usersMongo.js'
import { createHash, validatePassword} from '../utils/bcrypt.js'
import {createNewCart} from './cart.service.js'
import config from '../config/config.js'


export const findById = async(id) =>{
    try {
        const user = await usersManager.findById(id)
        return user
    } catch (error) {
        return error
    }
}
export const findByEmail = async(email) => {
    try {
        const user = await usersManager.findByEmail(email)
        return user
    } catch (error) {
        return error
    }
}

export const createUser = async(obj) => {
    try {
        let newUser = {...obj}
        
        // Hashear password
        if(!obj.method) { // esto es para que si se registra con github con contraseña ' ' que no me deje loguear normalmente
            const passwordHash = createHash(obj.password)
            newUser.password = passwordHash
        }

        // Rol de administrador
        if(obj.email === config.admin_email) {
            newUser.role = 'admin'
        }
            
        // Crea un carrito para el usuario cuando se registra y le asocia el id
        const cart = await createNewCart()
        newUser.cart = cart._id
            
        const user = await usersManager.createUser(newUser)
        return user
    } catch (error) {
        return error
    }
}

export const updatePass = async(email,password) => {
    // encriptar la pass 
    const passwordHash = createHash(password)

    // actualizar el user
    try {
        const user = await usersManager.updateOneByEmail(email,{password: passwordHash})
        return user
    } catch (error) {
        return error
    }
}

export const updateRole = async(id,role) => {
    try {
        const user = await usersManager.updateOneById(id,{role: role})
        return user
    } catch (error) {
        return error
    }
}