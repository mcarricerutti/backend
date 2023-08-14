import { Schema, model } from "mongoose";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "user","premium"],
    default: "user"
  },
  password: {
    type: String,
    required: true
  },
  passwordModifiableUntil: {
    type: Date,
    default: Date.now,
  },
  cart: {
    type:
    {
      _id: false,
      id_cart: {
        type: Schema.Types.ObjectId,
        ref: "carts",
      }
    }
    ,
    default: null,
  },
});

const userModel = model("users", userSchema);
export default userModel;