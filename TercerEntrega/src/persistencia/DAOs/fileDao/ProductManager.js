import { promises as fs } from "fs";

// Desafio 2
export class Product {
  constructor(title,description,thumbnails,price,code,stock,status,category) {
    //constructor
    this.title = title;
    this.description = description;
    this.thumbnails = thumbnails??[];
    this.price = price;
    this.code = code;
    this.stock = stock;
    this.status = status;
    this.category = category;
  }
}

export class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
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

  async addProduct(product) {
    //Leer archivo
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const index = products.findIndex((el) => el.code == product.code);
    if (index == -1) {
      let id=ProductManager.incrementID();
      while(products.some((el) => el.id == id)){ //Si el id ya existe, incrementamos
        id=ProductManager.incrementID();
      }
      products.push({id:id, ...product});
      //Escribir archivo
      await fs.writeFile(this.path, JSON.stringify(products));
      //return products;
      return "Producto agregado";
    } else {
      return "Un producto con el mismo codigo ya existe";
    }
  }

  async getProducts() {
    //Leer archivo
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    return products;
  }

  async getProductById(id) {
    //Leer archivo
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const product = products.find((el) => el.id == id);
    return product ?? "Producto no encontrado";
  }

  async updateProduct(id, obj) {
    //Leer archivo
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const index = products.findIndex((el) => el.id == id);
    if (index !== -1) {
    //reemplazamos el objeto en el array
    for (const key in obj) {
      if (obj[key] !== undefined && products[index][key]!== undefined) {
        products[index][key]=obj[key]
      }
    }
    //Escribir archivo
    await fs.writeFile(this.path, JSON.stringify(products));
    return `Producto con id ${id} actualizado`;
    }
    return "Producto no encontrado";
  }

  async deleteProduct(id) {
    //Leer archivo
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const index = products.findIndex((el) => el.id == id);
    if (index !== -1) {
    //Eliminamos el objeto en el array
    products.splice(index, 1);
    //Escribir archivo
    await fs.writeFile(this.path, JSON.stringify(products));
    return `Producto con id ${id} eliminado`;
    }
    return "Producto no encontrado";
  }
}



// //Test del desafio 2  
// const pm = new ProductManager("./info.txt");
// console.log(await pm.getProducts());
// await pm.addProduct(producto1);
// await pm.addProduct(producto2);
// console.log(await pm.getProducts());
// console.log(await pm.getProductById(1));
// console.log(await pm.getProductById(3));
// await pm.updateProduct(1, productoeditado);
// console.log(await pm.getProducts());
// await pm.deleteProduct(1);
// console.log(await pm.getProducts());
// await pm.deleteProduct(2);
// console.log(await pm.getProducts());
// await pm.deleteProduct(2);


