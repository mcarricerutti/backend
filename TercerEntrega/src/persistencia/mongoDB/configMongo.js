import mongoose from "mongoose";
import 'dotenv/config'

export default mongoose.connect(process.env.URL_MONGODB_ATLAS)
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(error => console.log(error));
