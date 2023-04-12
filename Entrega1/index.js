class ProductManager{
    constructor(){
        this.products = [];
    }

    getProducts(){
        return this.products;
    }

    addProduct(title, description, price, thumbnail, code, stock){
        const producto = {
            id: this.generarId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log(`El producto con el nombre ${title} tiene campos vacios`)
            
        }else{
            const validarCode = this.products.find(validarCode => validarCode.code === code)
            if(validarCode){
                console.log(`El producto con el code ${code} ya existe`)
            }else{
                console.log(`El producto con el code ${code} se ha agregado con exito`)
                this.products.push(producto)
            }        
        }
    }


    getProductById(id){
        const searchProduct = this.products.find(producto => producto.id === id)
        if(searchProduct){
            return console.log('Este es tu produto ', searchProduct)
        }else{
            console.log(`El producto con el id ${id} no existe`)
        }
    }

    generarId() {
    let id = 1;
    if (this.products.length !== 0) {
      id = this.products[this.products.length - 1].id + 1;
    }
    return id;
  }
}

const allProducts = new ProductManager();
 
allProducts.addProduct("AKKO NEON", "Conjunto completo de teclas de perfil MDA.Contiene 227 teclas.", 55, "https://res.cloudinary.com/dpruqtqw2/image/upload/v1665240058/Captura_de_pantalla_221_c93rlm.png",12,  21);
allProducts.addProduct("Keyboard Bubble", "Contiene 126 teclas.", 30, "https://res.cloudinary.com/dpruqtqw2/image/upload/v1665239452/Captura_de_pantalla_220_gipfxu.png",13,  19);
allProducts.addProduct("FEKER IK75 V3", "Kit de bricolaje de teclado Hotswap.", 169, "https://res.cloudinary.com/dpruqtqw2/image/upload/v1665073123/WhatsApp_Image_2022-10-06_at_1.07.39_PM_dyhys1.jpg",14,  25);
allProducts.addProduct("AKKO ACR68 PRO", "Teclado mecánico al 65 % montado en junta.Contiene 68 teclas.", 139, "https://res.cloudinary.com/dpruqtqw2/image/upload/v1665072718/WhatsApp_Image_2022-10-06_at_1.07.39_PM_1_uv89jo.jpg",15, 20);
allProducts.addProduct("Battlefield Keycaps","Tema del campo de batalla de Epomaker,contiene 128 teclas.", 52, "https://res.cloudinary.com/dpruqtqw2/image/upload/v1665073254/WhatsApp_Image_2022-10-06_at_1.07.39_PM_7_sugule.jpg",16, 5);


console.log(allProducts.getProducts()) 
allProducts.getProductById(7)

//Resolucion

// class ProductManager {
//     constructor() {
//         this.products = []
//     }

//     addProduct(product) {
//         if (this.products.find(producto => producto.code == product.code)) {
//             return "Producto existente"
//         } else {
//             this.products.push(product)
//             //Producto con este code no existe
//         }
//     }

//     getProducts() {
//         return this.products
//     }

//     getProductById(id) {
//         const product = this.products.find(producto => producto.id == id)

//         if (product) { //Objeto o undefined
//             return product
//         }

//         return "Not Found"
//     }


// }

// class Product {
//     constructor(title = "", description = "", price = 0, thumbnail = "", code = "", stock = 0) {
//         this.title = title
//         this.description = description
//         this.price = price
//         this.thumbnail = thumbnail
//         this.code = code
//         this.stock = stock
//         this.id = Product.incrementID()
//     }

//     static incrementID() {
//         if (this.idIncrement) { //Existe esta propiedad
//             this.idIncrement++
//         } else {
//             this.idIncrement = 1
//         }
//         return this.idIncrement
//     }
// }

// const product1 = new Product("Arroz", "Arroz", 150, "", "A123", 20)
// const product2 = new Product("Fideos", "Fideos", 250, "", "F123", 10)
// const product3 = new Product("Azucar", "Azucar", 320, "", "A456", 30)
// const product4 = new Product("Te", "Te", 120, "", "T123", 40)
// const product5 = new Product()

// const productManager = new ProductManager()
// productManager.addProduct(product1)
// productManager.addProduct(product2)
// console.log(productManager.addProduct(product1))
// console.log(productManager.getProductById(2))
// console.log(productManager.getProductById(5))
// console.log(productManager.getProducts())