import userModel from '../../mongoDB/models/users.model.js'
import BasicMongo from './basicMongo.js'

class UsersMongo extends BasicMongo {
    constructor(model) {
        super(model);
    }
    async setPasswordModifiable(id, date) {
        try {
            const user= await userModel.findByIdAndUpdate(id, {passwordModifiableUntil:date}, {new: true});
            return user;
        } catch (error) {
            return error;
        }
    }
    async changePremiumRole(id) {
        try {
            const user= await userModel.findById(id);
            const role = user.role == "premium" ? "user" : "premium";
            const updatedUser = await userModel.findByIdAndUpdate(id, {role:role}, {new: true});
            return updatedUser;
        } catch (error) {
            return error;
        }
    }
}
export const usersMongo = new UsersMongo(userModel);