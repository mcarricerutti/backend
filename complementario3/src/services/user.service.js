import { usersMongo } from '../persistencia/DAOs/mongoDao/usersMongo.js';
import { createHash, validatePassword } from '../utils/bcript.js';
import { generateUser } from '../utils/faker.js';


class UserService {
    async findAll() {
        try {
            return await usersMongo.findAll();
        } catch (error) {
            return error;
        }
    }
    async findById(id) {
        try {
            return await usersMongo.findById(id);
        } catch (error) {
            return error;
        }
    }
    async findOne(filter) {
        try {
            return await usersMongo.findOne(filter);
        } catch (error) {
            return error;
        }
    }
    async findByIdAndPopulate(id, populateStr) {
        try {
            return await usersMongo.findByIdAndPopulate(id, populateStr);
        } catch (error) {
            return error;
        }
    }
    async findOneAndUpdate(filter, update, options) {
        try {
            return await usersMongo.findOneAndUpdate(filter, update, options);
        } catch (error) {
            return error;
        }
    }
    async create(user) {
        try {
            const hashPassword = createHash(user.password);
            const newUser = { ...user, password: hashPassword };
            return await usersMongo.create(newUser);
        } catch (error) {
            return error;
        }
    }
    async delete(id) {
        try {
            return await usersMongo.delete(id);
        } catch (error) {
            return error;
        }
    }
    async mockUsers(quantity) {
        try {
            const users = [];
            for (let i = 0; i < quantity; i++) {
                const user = generateUser();
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

    async changePremiumRole(id) {
        try {
            return await usersMongo.changePremiumRole(id);
        } catch (error) {
            return error;
        }
    }
}

const userService = new UserService();
export default userService;