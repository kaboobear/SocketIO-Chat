const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({    
    sender:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    talker:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    lastMessageDate:{
        type:Date,
        default: Date.now
    },
    unreadSenderMessages:{
        type:Number,
        default:0
    },
    unreadTalkerMessages:{
        type:Number,
        default:0
    }
},{timestamps:true});

module.exports = mongoose.model("Chat",ChatSchema);

