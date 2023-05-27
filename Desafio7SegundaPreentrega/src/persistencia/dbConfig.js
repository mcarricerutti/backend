import mongoose  from "mongoose";
import 'dotenv/config'

try {
   await mongoose.connect(process.env.URL_MONGODB_ATLAS)
  console.log('conectado a la base de datos con exito -ecommerce-')  
} catch (error) {
  console.log(error)
}