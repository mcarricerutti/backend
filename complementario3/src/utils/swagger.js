import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación APIs TECLAM",
            version: "1.0.0",
            description: "API",
            contact: {
                name: "Martina Carri Cerutti",
                url: "https://github.com/mcarricerutti",
                email: "mcerutti1717@gmail.com"
            }
        }
    },
    apis: [`${process.cwd()}/src/Docs/**/*.yaml`]
}

const specs= swaggerJSDoc(swaggerOptions);
export const serveSwagger=swaggerUiExpress.serve; 
export const setupSwagger=swaggerUiExpress.setup(specs);