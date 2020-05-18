const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const db = require("./config/keys").mongoURI;
const socketio = require('socket.io');
const http = require('http');

const user_route = require("./routes/user_route");
const chat_route = require("./routes/chat_route");
const Message = require('./models/message_model');
const Chat = require('./models/chat_model');
const User = require('./models/user_model');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(session({secret:'kaboo',resave:true,saveUninitialized:true}))
app.use(passport.initialize());
app.use(passport.session());


const server = http.createServer(app);
const io = socketio(server);
let currentRoom = 0;

io.on('connection', socket =>{
    socket.on("JoinUser",(chat)=>{
        // if(currentRoom !== 0) socket.leave(currentRoom);
        socket.join(chat);
        currentRoom = chat;
    })

    socket.on("DeleteMessages", arr =>{
        io.to(currentRoom).emit('MessageIsDeleted',arr);
    })

    socket.on("MessageIsSent",data=>{
        const message = new Message({message:data.message,chat:data.current_chat._id,author:data.author._id});
        message.save().then(newMessage => {
            Message.findById(newMessage._id).populate('author').then(newMessageData=>{
                if(data.current_chat.sender._id !== data.author._id){
                    Chat.findOneAndUpdate({_id:data.current_chat._id},{$set:{lastMessageDate:Date.now()},$inc:{unreadTalkerMessages:1}  },{new:true,useFindAndModify: false}).populate('sender').populate('talker').then(newChatData =>{
                        io.to(currentRoom).emit('MessageIsAdded',{newMessageData});
                        io.emit('RenewUnread',{newChatData});
                    }).catch(err=>{})
                }
                else{
                    Chat.findOneAndUpdate({_id:data.current_chat._id},{$set:{lastMessageDate:Date.now()},$inc:{unreadSenderMessages:1}},{new:true,useFindAndModify: false}).populate('sender').populate('talker').then(newChatData =>{
                        io.to(currentRoom).emit('MessageIsAdded',{newMessageData});
                        io.emit('RenewUnread',{newChatData});
                    }).catch(err=>{})
                }
            })
        });
    })

    socket.on("UserIsLogged",data=>{
        User.findOneAndUpdate({_id:data._id},{$set:{isOnline:true}},{new: true}).then(data=>{
            socket.broadcast.emit("OtherUserIsLogged",data)
        })
    })

    socket.on("UserIsLoggedOut",data=>{
        User.findOneAndUpdate({_id:data.user._id},{$set:{isOnline:false,lastOnlineDate:Date.now()}},{new: true,useFindAndModify: false}).then(UserData=>{
            if(data.current_chat === 0) socket.broadcast.emit("OtherUserIsLoggedOut",UserData)
            else{
                if(data.current_chat.sender._id === data.user._id){
                    Chat.findOneAndUpdate({_id:data.current_chat._id},{$set:{unreadTalkerMessages:0}},{new:true,useFindAndModify: false}).then(newChatData =>{
                        socket.broadcast.emit("OtherUserIsLoggedOut",UserData)
                    }).catch(err=>{})
                }
                else{
                    Chat.findOneAndUpdate({_id:data.current_chat._id},{$set:{unreadSenderMessages:0}},{new:true,useFindAndModify: false}).then(newChatData =>{
                        socket.broadcast.emit("OtherUserIsLoggedOut",UserData)
                    }).catch(err=>{})
                }
            }
        })
    })
})



mongoose
    .connect(db,{ useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true })
    .then(()=>{console.log("MongoDb was connected")})
    .catch((err)=>{console.log(err);})

app.use('/user',user_route);
app.use('/chat',chat_route);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    })
}

server.listen(port,()=>{console.log(`Server started on port ${port}`)}) 