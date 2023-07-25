export const generateUserErrorInfo = (user)=>{
    return `Uno o mas parametros incompletos.
    Lista de parametros requeridos:
    * first_name: debe ser string, se recibió ${user.first_name}
    * last_name: debe ser string, se recibió ${user.last_name}
    * age: debe ser number, se recibió ${user.age}
    * email: debe ser string, se recibió ${user.email}
    * password: debe ser string, se recibió ${user.password}`
}

export const generateProductErrorInfo = (product)=>{
    return `Uno o mas parametros incompletos.
    Lista de parametros requeridos:
    * title: debe ser string, se recibió ${product.title}
    * description: debe ser string, se recibió ${product.description}
    * code: debe ser string, se recibió ${product.code}
    * price: debe ser number, se recibió ${product.price}
    * stock: debe ser number, se recibió ${product.stock}
    * status: debe ser boolean, se recibió ${product.status}
    * category: debe ser string, se recibió ${product.category}`
}