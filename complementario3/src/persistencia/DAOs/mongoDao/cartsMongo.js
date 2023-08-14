import cartsModel from '../../mongoDB/models/carts.model.js'
import BasicMongo from './basicMongo.js'

class CartsMongo extends BasicMongo {
    constructor(model) {
        super(model);
    }
}
export const cartsMongo = new CartsMongo(cartsModel);