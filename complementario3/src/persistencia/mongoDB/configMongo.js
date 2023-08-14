import mongoose from "mongoose";

//Conexion a MongoDB Atlas
export default mongoose.connect(process.env.URL_MONGODB_ATLAS)
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(error => console.log(error));
