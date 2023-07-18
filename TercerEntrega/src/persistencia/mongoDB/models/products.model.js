import { Schema, model } from "mongoose";
import paginate from 'mongoose-paginate-v2';

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  thumbnails: [],
});

productSchema.plugin(paginate);//agrega el metodo paginate a todos los modelos
const productModel = model("products", productSchema);
export default productModel;
