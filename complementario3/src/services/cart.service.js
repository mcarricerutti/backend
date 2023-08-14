import { cartsMongo } from '../persistencia/DAOs/mongoDao/cartsMongo.js';

class CartService {
    async findAll() {
        try {
            return await cartsMongo.findAll();
        } catch (error) {
            return error;
        }
    }
    async findById(id) {
        try {
            return await cartsMongo.findById(id);
        } catch (error) {
            return error;
        }
    }
    async findByIdAndPopulate(id, populateStr) {
        try {
            return await cartsMongo.findByIdAndPopulate(id, populateStr);
        } catch (error) {
            return error;
        }
    }
    async findOneAndUpdate(filter, update, options) {
        try {
            return await cartsMongo.findOneAndUpdate(filter, update, options);
        } catch (error) {
            return error;
        }
    }
    async create(data) {
        try {
            return await cartsMongo.create(data);
        } catch (error) {
            return error;
        }
    }
    async delete(id) {
        try {
            return await cartsMongo.delete(id);
        } catch (error) {
            return error;
        }
    }
}

const cartService = new CartService();
export default cartService;