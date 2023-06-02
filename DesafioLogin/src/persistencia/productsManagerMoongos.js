import productModel from "../persistencia/models/productos.model.js"

export default class ProductsManagerMongoose{

    
    async createProduct(prod){
        try {
            const newProduct = productModel.create(prod)
            return newProduct
        } catch (error) {
            console.log(error)
        }
    }
    
    async deleteById(id){
        try {
            const deleteProduct = await productModel.deleteOne({'_id':id})
            return 'Se ha eliminado el producto',deleteProduct
        } catch (error) {
            console.log(error)
        }
    }

    async updateProduct(id, newValue, value){
        try {
                if(newValue === "title"){
                    const updateNew = productModel.updateOne( { '_id' : id }, {$set:{ "title" : value } }); 
                    return updateNew
                }

                if(newValue === "description"){
                    const updateNew = productModel.updateOne( { '_id' : id }, {$set:{ "description" : value } }); 
                    return updateNew
                }

                if(newValue === "code"){
                    const updateNew = productModel.updateOne( { '_id' : id }, {$set:{ "code" : value } }); 
                    return updateNew
                }

                if(newValue === "precio"){
                    const updateNew = productModel.updateOne( { '_id' : id }, {$set:{ "precio" : value } }); 
                    return updateNew
                }

                if(newValue === "status"){
                    const updateNew = productModel.updateOne( { '_id' : id }, {$set:{ "status" : value } }); 
                    return updateNew
                }

                if(newValue === "category"){
                    const updateNew = productModel.updateOne( { '_id' : id }, {$set:{ "category" : value } }); 
                    return updateNew
                }

                if(newValue === "stock"){
                    const updateNew = productModel.updateOne( { '_id' : id }, {$set:{ "stock" : value } }); 
                    return updateNew
                }

                if(newValue === "thumbnail"){
                    const updateNew = productModel.updateOne( { '_id' : id }, {$set:{ "thumbnail" : value } }); 
                    return updateNew
                }

            return 'prod editado ok ', updateNew
        } catch (error) {
            return error;
        }
    }

    async deleteAll(){
        return await productModel.deleteMany()
    }
}