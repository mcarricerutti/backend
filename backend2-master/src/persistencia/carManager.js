import {cartsModel} from './models/carts.model.js';
import { productsModel } from './models/productos.model.js';

export default class CartManager {

    async createCart(){
        try {
            const createCart = await cartsModel.create({
                cart:[]
            })
            return createCart
        } catch (error) {
            console.log(error)
        }
    }


    async getCartsById(id){
        try {
            const getCart =await cartsModel.findById(id)
            return getCart
        } catch (error) {
            console.log(error)
        }
    }

    async addProductsCart(idC, idP, quantity){
        try {
            const getCart = await cartsModel.findById(idC)
            const getProd = await productsModel.findById(idP)
            if(getCart){
                const identify = getCart.cartListProduct.find(prod => prod.prodId === idP)
                if(identify){
                    const addQuantity = getCart.cartListProduct.map(prod=>{
                        if(prod.prodId == idP){
                            prod.quantity += quantity
                        }
                        return prod
                    })
                    return await cartsModel.findByIdAndUpdate(idC, {
                        cartListProduct : addQuantity
                    })
                }else{
                    const addToCart =await cartsModel.findByIdAndUpdate({'_id':idC},
                    {$push:{cartListProduct:{prodId:idP, productName: getProd.name,
                    quantity: quantity}}})
                    return addToCart
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProd(idP){
        try {
            const deleteProd = await cartsModel.deleteOne({'_id':idP})
            return deleteProd
        } catch (error) {
            console.log(error)
        }
    }
}
