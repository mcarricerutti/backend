import { Schema, model } from "mongoose";

const counterSchema = new Schema({
    id:{
        type: String,
    },
    seq:{
        type: Number,
        default: 0
    }
});

const counterModel = model("counter", counterSchema);
export default counterSchema;

export const getNextSequence = async (name) => {
    try {
        if(!(await counterModel.exists({id: name}))){
            const newCounter = new counterModel({
                id: name,
                seq: 0
            });
            await newCounter.save();
        }
        else{
            const ret=await counterModel.findOneAndUpdate(
                { id: name },
                { $inc: { seq: 1 }},
                { new: true});
            return ret.seq;
        }

    } catch (error) {
        return error;
    } 
}
