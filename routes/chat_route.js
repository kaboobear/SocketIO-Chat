const express = require('express');
const router = express.Router();
const Chat = require('../models/chat_model')
const Message = require('../models/message_model')





router.post('/',(req,res)=>{
    Message.find({chat:req.body.chat_id}).populate('author').then(data =>{
        res.json(data);
    })
})

router.post('/addMessage',(req,res)=>{
    Message.find({chat:req.body.chat_id}).then(data =>{
        res.json(data);
    })
})

router.post('/deleteMessages',(req,res)=>{
    Message.deleteMany({_id:{$in:req.body}}).then(data =>{
        res.json(data);
    })
})


router.post('/changeUnread',(req,res)=>{
    if(req.body.chat.sender._id !== req.body.user_id){
        Chat.findOneAndUpdate({_id:req.body.chat._id},{$set:{unreadSenderMessages:0}},{new:true,useFindAndModify: false}).populate('sender').populate('talker').then(data =>{
            res.json(data);
        })
    }
    else{
        Chat.findOneAndUpdate({_id:req.body.chat._id},{$set:{unreadTalkerMessages:0}},{new:true,useFindAndModify: false}).populate('sender').populate('talker').then(data =>{
            res.json(data);
        })
    }

})


router.post('/getChats',(req,res)=>{
    const user = req.body;
    Chat.find({$or: [{sender:user.user_id},{talker:user.user_id}]}).sort({ lastMessageDate: -1 }).populate('sender').populate('talker').then(data =>{
            res.json(data);
    })
})

router.post('/addChat',(req,res)=>{
    const user = req.body;
    const newChat = new Chat({sender:user.currentId,talker:user.friendId,unreadMessages:0,})
    newChat.save().then(newChatData =>{
        Chat.findById(newChatData._id).populate('sender').populate('talker').then(resultData =>{
            res.json(resultData);
        })
    })
})


module.exports = router;




