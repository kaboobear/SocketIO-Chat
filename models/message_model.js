const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    message:{
        type:String,
        required:true
    },
    chat:{
        type:Schema.Types.ObjectId,
        ref:'Chat'
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true});

module.exports = mongoose.model("Message",MessageSchema);

