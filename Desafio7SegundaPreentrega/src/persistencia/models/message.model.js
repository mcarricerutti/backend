import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  nombre:{
    type:String,
    required:true
  },
  mensaje: {
    type:String,
    required: true
  },
});

export const messagesModel = mongoose.model('message', messageSchema);
