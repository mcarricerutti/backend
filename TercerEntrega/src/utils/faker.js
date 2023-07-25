import {fakerES, faker} from '@faker-js/faker';

export const generateUser = () => {
    return {
        _id: fakerES.database.mongodbObjectId(),
        first_name: fakerES.person.firstName(),
        last_name: fakerES.person.lastName(),
        email: fakerES.internet.email(),
        age: fakerES.number.int(90),
        role: Math.random()<0.8?'user':'admin',
        password: fakerES.internet.password(),
        cart:{
            id_cart: fakerES.database.mongodbObjectId(),
        }
    }
}

export const generateProduct = () => {
    const thumbnails = [];
    for (let i = 0; i < fakerES.number.int({min:1,max:3}); i++) {
        thumbnails.push(fakerES.image.url());
    }

    return {
        _id: fakerES.database.mongodbObjectId(),
        title: fakerES.commerce.productName(),
        description: fakerES.commerce.productDescription(),
        code: fakerES.string.uuid(),
        category:fakerES.commerce.department(), 
        price: fakerES.commerce.price(),
        stock: fakerES.number.int(30),
        status: fakerES.datatype.boolean(),
        thumbnails: thumbnails
    }
}