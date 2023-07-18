import { productsMongo } from '../persistencia/DAOs/mongoDao/productsMongo.js';

class ProductService {
    async findAll() {
        try {
            return await productsMongo.findAll();
        } catch (error) {
            return error;
        }
    }
    async findById(id) {
        try {
            return await productsMongo.findById(id);
        } catch (error) {
            return error;
        }
    }
    async findByIdAndPopulate(id, populateStr) {
        try {
            return await productsMongo.findByIdAndPopulate(id, populateStr);
        } catch (error) {
            return error;
        }
    }
    async findByIdAndUpdate(id, data) {
        try {
            return await productsMongo.findByIdAndUpdate(id, data);
        } catch (error) {
            return error;
        }
    }
    async findOneAndUpdate(filter, update, options) {
        try {
            return await productsMongo.findOneAndUpdate(filter, update, options);
        } catch (error) {
            return error;
        }
    }
    async create(data) {
        try {
            return await productsMongo.create(data);
        } catch (error) {
            return error;
        }
    }
    async delete(id) {
        try {
            return await productsMongo.delete(id);
        } catch (error) {
            return error;
        }
    }
    async insertMany(data) {
        try {
            return await productsMongo.insertMany(data);
        } catch (error) {
            return error;
        }
    }
    async paginate(filter, options) {
        try {
            return await productsMongo.paginate(filter, options);
        } catch (error) {
            return error;
        }
    }
}

const productService = new ProductService();
export default productService;