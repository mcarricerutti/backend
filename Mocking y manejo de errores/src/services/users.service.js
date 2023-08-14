import {usersManager} from '../persistencia/DAOs/MongoDAOs/usersMongo.js'
import { createHash, validatePassword} from '../utils/bcrypt.js'
import {createNewCart} from './cart.service.js'
import config from '../config/config.js'
import { generateUser } from '../utils/faker.js';

class UserService{
    async findById (id){
        try {
            const user = await usersManager.findById(id)
            return user
        } catch (error) {
            return error
        }
    }
    async findByEmail(email){
        try {
            const user = await usersManager.findByEmail(email)
            return user
        } catch (error) {
            return error
        }
    }
    
    async createUser(obj) {
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
    
    async mockUsers(quantity){
        try {
            const users = [];
            for (let i = 0; i < quantity; i++) {
                const user = generateUser();
                console.log(user);
                users.push(user);
            }
            return users;
        } catch (error) {
            return error;
        }
    }
    
    async resetPassword(email, newPassword) {
        try {
            const user = await usersMongo.findOne({ email: email });
            if (!user) {
                throw new Error("Email no registrado");
            }
            if (validatePassword(newPassword, user.password)) {
                throw new Error("La contraseña no puede ser igual a la anterior");
            }
            const hashPassword = createHash(newPassword)
            const filter = { email: email };
            const update = { password: hashPassword };
            const options = { new: true };
            const updatedUser = await usersMongo.findOneAndUpdate(filter, update, options);
            return updatedUser;
            
        } catch (error) {
            return error;
        }
    }
    
    async setPasswordModifiable(id, date) {
        try {
            return await usersMongo.setPasswordModifiable(id, date);
        } catch (error) {
            return error;
        }
    }
    
    async setPasswordNotModifiable(user) {
        try {
            return await usersMongo.setPasswordModifiable(user._id, Date.now());
        } catch (error) {
            return error
        }
    }
}

const userService = new UserService()
export default userService