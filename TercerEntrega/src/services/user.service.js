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
                console.log(user);
                users.push(user);
            }
            return users;
        } catch (error) {
            return error;
        }
    }
}

const userService = new UserService();
export default userService;