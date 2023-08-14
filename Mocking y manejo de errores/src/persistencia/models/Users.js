import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    gender: {
        type: String,
        required: true,
        default: "male"
    },
    age: {
        type: Number,
        required: true,
        default: 18
    },
    password: {
        type: String,
        required: true
    },
    passwordModifiableUntil: {
        type: Date,
        default: Date.now,
      },
    role: {
        type: String,
        default: "user"
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "carts"
    },

});
export default model("users", userSchema);