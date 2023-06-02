import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  products: {
    type: [
      {
        _id: false,
        id_prod: {
          type: Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: Number,
      },
    ],
    default: [],
  },
});

export const cartModel = model("cart", cartSchema);

// import mongoose from "mongoose";

// const cartSchema = new mongoose.Schema({
//     cartListProduct: []
// })

// export const cartsModel = mongoose.model('carts',cartSchema)