const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const uploadToCloudinary = require('../../helper/uploadToCloudinary');

//[GET] /chat
module.exports.index = async (req,res)=>{
    const userId = res.locals.user.id;    
    const fullname = res.locals.user.fullname;
    //socket
    _io.once("connection",(socket)=>{ // io.once chỉ load duy nhât một lần khác với io.on mỗi lần load trang là 1 làn load connection
        socket.on("CLIENT_SEND_MESSAGE",async (data)=>{
            let images = [];
            
            for (const imageBufer of data.images) {
                const link = await uploadToCloudinary(imageBufer);
                   
                images.push(link);
            }
            console.log(data.images);
            
            // save in databe
            const chat = new Chat({
                user_id:userId,
                content:data.content,
                images:images
            });
            await chat.save();

            // trả về data cho client
            _io.emit("SERVER_RETURN_MESSAGE",{
                userId:userId,
                fullname:fullname,
                content: data.content,
                images:images
            });
        
        }) ;
        socket.on("CLIENT_SEND_TYPING",async(type)=>{
                socket.broadcast.emit("SERVER_RETURN_TYPING",{
                    userId:userId,
                    fullname:fullname,
                    type:type
                })
      
            });
      
        
    })
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