import productModel from '../../mongoDB/models/products.model.js'
import BasicMongo from './basicMongo.js'

class ProductsMongo extends BasicMongo {
    constructor(model) {
        super(model);
    }
    async paginate(filter, options) {
        try {
            return await productModel.paginate(filter, options);
        } catch (error) {
            return error;
        }
    }
}
export const productsMongo = new ProductsMongo(productModel);