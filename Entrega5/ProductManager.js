import fs from 'fs'
import { __dirname } from './utils.js';

export  class ProductManager {
  constructor () {
    this.path =  __dirname+"/products/products.json"
    this.cartPath = __dirname+"products/productsCart.json"
    this.cartProd = []
  }

  async getProducts() {
      if (fs.existsSync(this.path)) {
        let productos = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(productos)
      } else {
        return [];
      }
  }



  async addProduct(title, description,code, precio,status =true,stock,category, thumbnail = []) {
    const productsFile = await this.getProducts()
    if (!(title, description,code,precio,stock,category)) {
      return 401

    } else if (productsFile.length !== 0 && productsFile.some((product) => product.code === code)) {
      return 402
    }


    else {
      let product = {
        title,
        description,
        code,
        precio,
        status,
        thumbnail,
        category,
        stock,
        id: await this.#generarIdProd(),
      };
      productsFile.push(product);
     await fs.promises.writeFile(this.path, JSON.stringify(productsFile))
    }
  }

  async getProductById(id) {
    const productFile = await this.getProducts()
    const searchProductId = productFile.find(idProduc => idProduc.id === id)
    return searchProductId
  }
  
  async updateProduct(id, object){
    let copyProduct = await this.getProducts()
    let escanerCopy = copyProduct.find(product => product.id === id)
    const {title, description, precio, thumbnail, code, stock } = object
    if(code && copyProduct.some(prod => prod.code === code)){
      return 400
    }else if(code){
      escanerCopy.code = code
    }
    if(title){
      escanerCopy.title = title
    }
    if(description){
      escanerCopy.description = description
    }
    if(price){
      escanerCopy.precio = precio
    }
    if(thumbnail){
      escanerCopy.thumbnail = thumbnail
    }
    if(stock){
      escanerCopy.stock = stock
    }
    await fs.promises.writeFile(this.path, JSON.stringify(copyProduct))
  }

  async deleteProductById(id){
    const deletetFile = await this.getProducts()
    const deleteProduct = deletetFile.filter(prod => prod.id !== id)
    await fs.promises.writeFile(this.path, JSON.stringify(deleteProduct))
  }
 
  async #generarIdProd() {
    let id = 1 
    const countFile = await this.getProducts()
    if(countFile.length !== 0){
      id = countFile[countFile.length -1].id + 1
    }
    return id
  }

  //---------Carrito

  async getProductsCart(){
    try {
      if(fs.existsSync(this.cartPath)){
        const prodCart = await fs.promises.readFile(this.cartPath,'utf-8')
        const prodCartJSON = JSON.parse(prodCart)
        return prodCartJSON
      }else{
        return []
      }
      
    } catch (error) {
      console.log(error)
    }

  }

  
  async createCart(){
    const cartFile = await this.getProductsCart()
    let newCart = {
      id: await this.#generateIdCart(),
      products:[]
    }
    cartFile.push(newCart)
    await fs.promises.writeFile(this.cartPath, JSON.stringify(cartFile))
    return newCart
  }
  
  async addCart(idCart, idProd){
    let cartFile = await this.getProductsCart()
    let cartUpdate = cartFile.find(u => u.id === idCart)?? 400
    if(cartUpdate === 400){
      return cartUpdate
    }else if(cartUpdate['products'].some(prod => prod.id === idProd)){
      let prodQuantity = cartUpdate["products"].find(prod => prod.id === idProd)
      prodQuantity["Quantity"]++
    }else{
      let prodCart = {
        id: idProd,
        Quantity:1
      }
      cartUpdate["products"].push(prodCart)
    }
    await fs.promises.writeFile(this.cartPath, JSON.stringify(cartFile))
    return cartUpdate
  }
  
  async #generateIdCart(){
    let id = 1
    const cartFile = await this.getProductsCart()
    if(cartFile.length !== 0){
      id = cartFile[cartFile.length -1].id + 1
    }
    return id
  }

  // manejo con el servidor

  async listToShow (id){
    let products = await this.getProducts();
    if(products.length === 0){
      return products
    }

    else if(id){
      let products = await this.getProducts();
      let productsListFiltered = products.filter(u => u.id !== id);
      let productsList = productsListFiltered.map((product) =>{
        let productSimplificado = {
          title: product.title,
          price: product.precio
        }
        return productSimplificado
     } )
     return productsList
    }
    else{
      let productsList = [];
      productsList = products.map((product) =>{
        let productSimplificado = {
          title: product.title,
          price: product.precio
        }
        return productSimplificado
    }     
      )
      
      return productsList
    }
    
  }
  
}

