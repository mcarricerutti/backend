import {
    promises as fs
} from "fs"

export class ProductManager {
    constructor(path) {
        this.path = path
    }

    static incrementarID() {
        if (this.idIncrement) {
            this.idIncrement++
        } else {
            this.idIncrement = 1
        }
        return this.idIncrement
    }

    async addProduct(product) {
        let {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        } = product;

        const productos = await this.getProducts()

        if (productos.some(p => p.code === code)) {
            throw new Error(`${code} repetido`)

        } else{
            product.id = ProductManager.incrementarID()
            productos.push(product)

        }
        await fs.writeFile(this.path, JSON.stringify(productos))
    }

    async getProducts() {
        const consulta = await fs.readFile(this.path, 'utf-8')
        const respuesta = JSON.parse(consulta)
        return respuesta
    }

    async getProductById(id) {
        const productos = await this.getProducts()

        const searchProductId = productos.find(idProduc => idProduc.id === id)

        if (searchProductId) {
            return searchProductId
        } else {
            throw new Error(`El producto ${id} no existe`)
        }
    }

    async updateProduct(id, campo, newValor) {
        const productos = await this.getProducts()


        const updateProd = productos.map(product => {
            if (product.id === id) {
                product[campo] = newValor
                return product
            } else {
                return product
            }
        })

        await fs.writeFile(this.path, JSON.stringify(updateProd))
    }

    async deleteProduct(id) {
        await this.getProductById(id);

        const productos = await this.getProducts()

        const filteredList = productos.filter(idProduc => idProduc.id !== id)
        if (!filteredList) {
            console.log("ERROR: No se encuentra el id especificado")
        } else {
            await fs.writeFile(this.path, JSON.stringify(filteredList))
        }
    }
}



class Product {
    constructor(title = "", description = "", price = 0, thumbnail = "", code = "", stock = 0) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

const TXT = async () => {
    await fs.writeFile('./info.txt', '[]')
}
await TXT()

let allProducts = new ProductManager('./info.txt')

console.log(await allProducts.getProducts());

let teclado1 = new Product("AKKO NEON", "Conjunto completo de teclas de perfil MDA.Contiene 227 teclas.", 55, "ruta1", "T20", 21);

let teclado2 = new Product("Keyboard Bubble", "Contiene 126 teclas.", 30, "ruta2", "T21", 21);

let teclado3 = new Product("FEKER IK75 V3", "Conjunto completo de teclas de perfil MDA.Contiene 227 teclas.", 75, "ruta3", "T23", 21);


let kit1 = new Product("AKKO ACR68 PRO", "Conjunto completo de teclas de perfil MDA.Contiene 227 teclas.", 45, "ruta4", "K20", 21);

await allProducts.addProduct(teclado1);
await allProducts.addProduct(teclado2);
await allProducts.addProduct(teclado3);
await allProducts.addProduct(kit1);

await allProducts.getProducts();

console.log("Lista de productos:")
console.log(await allProducts.getProducts());

console.log("Filtrando producto: ")
console.log(await allProducts.getProductById(2));

console.log("Un producto fue modificado:")
await allProducts.updateProduct(4, "price", 299);
console.log(await allProducts.getProducts());

console.log("Un producto fue eliminado")
await allProducts.deleteProduct(1);
console.log(await allProducts.getProducts())