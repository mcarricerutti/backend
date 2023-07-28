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