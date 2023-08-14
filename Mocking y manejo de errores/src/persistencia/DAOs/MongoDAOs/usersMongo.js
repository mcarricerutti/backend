import userModel from '../../models/Users.js'

class UsersManager {

    async findById(id) {
        try {
            const user = await userModel.findById(id)
            return user
        } catch (error) {
            return error
        }
    }
    async findByEmail(email) {
        try {
            const user = await userModel.findOne({ email: email })
            return user
        } catch (error) {
            return error
        }
    }

    async createUser(obj) {
        try {
            const user = await userModel.create(obj)
            return user
        } catch (error) {
            return error
        }
    }

    async setPasswordModifiable(id, date) {
        try {
            const user= await userModel.findByIdAndUpdate(id, {passwordModifiableUntil:date}, {new: true});
            return user;
        } catch (error) {
            return error;
        }
    }
}

export const usersManager = new UsersManager()