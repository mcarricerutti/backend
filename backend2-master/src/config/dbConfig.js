import mongoose  from "mongoose";
import 'dotenv/config'

try {
   await mongoose.connect(process.env.URL_MONGODB_ATLAS)
  console.log('conectado a la base de datos "session-mongo-storage" con exito')  
} catch (error) {
  console.log(error)
}