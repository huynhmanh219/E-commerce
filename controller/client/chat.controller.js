const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const uploadToCloudinary = require('../../helper/uploadToCloudinary');
const chatSocket = require("../../sockets/client/chat.socket");
//[GET] /chat
module.exports.index = async (req,res)=>{

    //socket
    chatSocket(res);
    //end socket

    
    //lấy data từ db 
    const chats = await Chat.find({
        deleted:false
    });
    //end lấy data từ db 
    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id:chat.user_id,
            deleted:false
        }).select("fullname");
        chat.infoUser = infoUser;
    } 

    res.render("client/pages/chat/index",
        {
            pageTitle:"Chat",
            chats : chats
        }
    )
}