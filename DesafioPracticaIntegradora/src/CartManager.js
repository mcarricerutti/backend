import { promises as fs } from "fs";
import { ProductManager } from "./ProductManager.js";

export class CartManager {
  constructor(cartsPath, productsPath) {
    this.cartPath = cartsPath;
    this.productsPath = productsPath;
  }
  static incrementID() {
    if (this.idIncrement) {
      //Existe esta propiedad
      this.idIncrement++;
    } else {
      this.idIncrement = 1;
    }
    return this.idIncrement;
  }

  async addProduct(cid, pid, quantity) {
    const carts = JSON.parse(await fs.readFile(this.cartPath, "utf-8")); //Leer archivo Carritos
    const cartIndex = carts.findIndex((el) => el.id == parseInt(cid)); //Buscamos el carrito
    if (cartIndex !== -1) {
      const pm = new ProductManager(this.productsPath);
      const products = await pm.getProducts();
      const index = products.findIndex((el) => el.id == parseInt(pid));
      if (index !== -1) {
        const newProduct = { id: parseInt(pid), quantity: parseInt(quantity) }; //Creamos nuevo producto
        const existingProductIndex=carts[cartIndex].products.findIndex((el) => el.id == parseInt(pid)); //Buscamos el producto en el carrito
        if(existingProductIndex!== -1){
          carts[cartIndex].products[existingProductIndex].quantity+=parseInt(quantity); //Reemplazamos la cantidad
          await fs.writeFile(this.cartPath, JSON.stringify(carts)); //Escribimos al archivo
          return `Producto ${pid} existente en carrito ${cid} aumenta su cantidad en ${quantity} unidades`;
        }
        else{
          carts[cartIndex].products.push(newProduct); //Agregamos productos al carrito
          await fs.writeFile(this.cartPath, JSON.stringify(carts)); //Escribimos al archivo
          return `Producto ${pid} agregado al carrito ${cid} con ${quantity} unidades`;
        }

      } else {
        return `El producto ${pid} no existe`;
      }
    } else {
      return `El carrito ${cid} no existe`;
    }
  }

  async createCart() {
    const carts = JSON.parse(await fs.readFile(this.cartPath, "utf-8")); //Leer archivo
    const cart = { id: CartManager.incrementID(), products: [] }; //Creamos el objeto carrito
    carts.push(cart); //Agregamos el carrito al array de Carritos
    await fs.writeFile(this.cartPath, JSON.stringify(carts)); //Escribimos al archivo
    return `Carrito ${cart.id} creado`;
  }

  async getCartById(cid) {
    const carts = JSON.parse(await fs.readFile(this.cartPath, "utf-8")); //Leer archivo
    const cart = carts.find((el) => el.id == parseInt(cid)); //Buscamos el carrito
      return cart??"Carrito no encontrado"
  }

  async getCarts() {
    const carts = JSON.parse(await fs.readFile(this.cartPath, "utf-8")); //Leer archivo
    return carts;
  }
}
