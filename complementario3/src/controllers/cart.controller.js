import cartService from '../services/cart.service.js';
import productService from '../services/product.service.js';
import ticketService from '../services/ticket.service.js';
import { getNextSequence } from '../persistencia/mongoDB/models/counters.model.js';
import sendMail from '../utils/nodemailer.js';
import EErrors from '../services/errors/enumError.js';
import CustomError from '../services/errors/CustomError.js';

export const createCart = async (req, res) => {
    try {
        const newCart = await cartService.create({ products: [] });
        res.status(200).send(newCart);
    }
    catch (error) {
        req.logger.error("Error en createCart");
        res.status(500).send("ERROR: " + error);
    }
};

export const getCarts = async (req, res) => {
    try {
        const carts = await cartService.findAll();
        res.status(200).send(carts);
    } catch (error) {
        req.logger.error("Error en getCarts");
        res.status(500).send("ERROR: " + error);
    }
};

export const getCartById = async (req, res) => {
    const cid = req.params.cid
    try {
        const cart = await cartService.findByIdAndPopulate(cid, 'products.id_prod');
        res.status(200).render('carts', { cart: cart });
    } catch (error) {
        req.logger.error("Error en getCartById");
        res.status(500).send("ERROR: " + error);
    }
};

export const addProductOnCart = async (req, res, next) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body
    try {
        const cart = await cartService.findById(cid);
        const product = await productService.findById(pid);
        if (!product) {
            res.status(200).send("Producto no existe" + product);
        }
        if(req.session.user.role == "premium" && product.owner == req.session.user.email){
            CustomError.createError({
                name: "Add to cart product error",
                cause: "User can't add owned product to cart",
                message: "Error trying to add product to cart",
                code: EErrors.AUTORIZATION_ERROR,
            }); //Lanzo un error
        }
        if (cart.products.find(product => product.id_prod == pid)) {
            //find cart and product and update incrementing quantity
            const filter = { _id: cid, "products.id_prod": pid };
            const update = { $inc: { "products.$.quantity": quantity } };
            const options = { new: true };
            const updatedCart = await cartService.findOneAndUpdate(filter, update, options);
            // res.status(200).send(updatedCart);
            res.status(200).redirect(`/api/carts/${cid}`);
        }
        else {
            //if product is not in cart, add it
            const filter = { _id: cid };
            const update = { $push: { products: { id_prod: pid, quantity: quantity } } };
            const options = { new: true };
            const updatedCart = await cartService.findOneAndUpdate(filter, update, options);
            req.logger.info(updatedCart);
            // res.status(200).send(updatedCart);
            res.status(200).redirect(`/api/carts/${cid}`);
        }
    } catch (error) {
        req.logger.error("Error en addProductOnCart");
        next(error);
    }
};

export const deleteProductOnCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        //find cart and delete product
        const filter = { _id: cid };
        const update = { $pull: { products: { id_prod: pid } } };
        const options = { new: true };
        const updatedCart = await cartService.findOneAndUpdate(filter, update, options);
        res.status(200).send(updatedCart);
    } catch (error) {
        req.logger.error("Error en deleteProductOnCart");
        res.status(500).send("Error: Cart ID o Product ID no existen\n\n" + error);
    }
};

export const deleteCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        //find cart and delete products
        const filter = { _id: cid };
        const update = { products: [] };
        const options = { new: true };
        const updatedCart = await cartService.findOneAndUpdate(filter, update, options);
        res.status(200).send(updatedCart);
    } catch (error) {
        req.logger.error("Error en deleteCart");
        res.status(500).send("Error: Cart ID no existe\n\n" + error);
    }
};

export const updateProductOnCart = async (req, res) => {
    const cid = req.params.cid;
    const products = req.body.products;
    try {
        //find cart and update products
        const filter = { _id: cid };
        const update = { products: products };
        const options = { new: true };
        const updatedCart = await cartService.findOneAndUpdate(filter, update, options);
        res.status(200).send(updatedCart);
    } catch (error) {
        req.logger.error("Error en updateProductOnCart");
        res.status(500).send("Error: Cart ID o formato del arreglo products incorrectos \n\n" + error);
    }
};

export const updateProductQuantityOnCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body //Consulto el dato quantity enviado por postman
    try {
        //find cart and product and update quantity
        const filter = { _id: cid, "products.id_prod": pid }
        const update = { $set: { "products.$.quantity": quantity } }
        const options = { new: true };
        const updatedCart = await cartService.findOneAndUpdate(filter, update, options);
        res.status(200).send(updatedCart);

    } catch (error) {
        req.logger.error("Error en updateProductQuantityOnCart");
        res.status(500).send("Error: Cart ID o Product ID o quantity Incorrectos \n\n" + error);
    }
};

export const purchaseCart = async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartService.findByIdAndPopulate(cid, 'products.id_prod');
        const productsWithStock = [];
        const productsWithoutStock = [];
        let purchaseTotal = 0;
        
        //check if products have enough stock
        await asyncForEach(cart.products, async (cartProduct) => {
            const pid = cartProduct.id_prod._id;
            const product = await productService.findById(pid);

            if (product.stock >= cartProduct.quantity) {
                //Se agrega producto al array de productos con stock
                productsWithStock.push(cartProduct)

                //se suma el precio del producto al total de la compra
                purchaseTotal += product.price * cartProduct.quantity;

                //se elimina el producto del carrito
                const filterCart = { _id: cid };
                const updateCart = { $pull: { products: { id_prod: cartProduct.id_prod._id } } };
                const optionsCart = { new: true };
                const updatedCart = await cartService.findOneAndUpdate(filterCart, updateCart, optionsCart);

                // Se reduce el stock del producto
                const filterProduct = { _id: cartProduct.id_prod._id }
                const updateProduct = { $inc: { stock: -cartProduct.quantity } };
                const optionsProduct = { new: true };
                const updatedProduct = await productService.findOneAndUpdate(filterProduct, updateProduct, optionsProduct);
            }
            else {
                productsWithoutStock.push({id:cartProduct.id_prod._id, stock:product.stock, purchaseAttemtQuantity:cartProduct.quantity})
            }
        });

        //Create ticket
        if (productsWithStock.length > 0) {
            const newTicket = await ticketService.create({
                code: await getNextSequence("ticketIncrement"),
                purchaser: req.user.email,
                products: productsWithStock,
                amount: purchaseTotal
            });
            if (productsWithoutStock.length > 0) {
                await sendMail(
                    req.user.email, 
                    `Confirmacion de compra #${newTicket.code}`, 
                    "Compra efectuada exitosamente", 
                    `<h1>Hemos confirmado tu compra</h1>
                    <h3>El total de tu compra es de $${newTicket.amount}</h3>
                    <h3>Los productos que compraste son:</h3>
                    <ul>
                        ${newTicket.products.map(product => `<li>${product.id_prod} - ${product.quantity} unidades</li>`)}
                    </ul>
                    <h3>Algunos productos no tenian stock suficiente para realizar la compra, por lo que no se agregaron al ticket</h3>
                    <h3>Gracias por tu compra</h3>`, 
                    null);
                res.status(200).json({ message: "Algunos productos no tienen stock suficiente para realizar la compra", ticket: newTicket, productsWithoutStock: productsWithoutStock });
            } else {
                await sendMail(
                    req.user.email, 
                    `Confirmacion de compra #${newTicket.code}`, 
                    "Compra efectuada exitosamente", 
                    `<h1>Hemos confirmado tu compra</h1>
                    <h3>El total de tu compra es de $${newTicket.amount}</h3>
                    <h3>Los productos que compraste son:</h3>
                    <ul>
                        ${newTicket.products.map(product => `<li>${product.id_prod} - ${product.quantity} unidades</li>`)}
                    </ul>
                    <h3>Gracias por tu compra</h3>`, 
                    null);
                res.status(200).json({ message: "Compra realizada con exito", ticket: newTicket });
            }
        }
        else {
            if (productsWithoutStock.length > 0) {
                res.status(200).json({ message: "Los productos no tienen suficiente stock para realizar la compra", productsWithoutStock: productsWithoutStock });
            } else {
                res.status(200).json({ message: "No hay productos en el carrito" });
            }
        }
    } catch (error) {
        req.logger.error("Error en purchaseCart");
        res.status(500).send(error);
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}