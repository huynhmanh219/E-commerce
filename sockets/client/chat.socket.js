const uploadToCloudinary = require('../../helper/uploadToCloudinary');
const Chat = require("../../models/chat.model");


module.exports = (res)=> {
    const userId = res.locals.user.id;    
    const fullname = res.locals.user.fullname;
    _io.once("connection",(socket)=>{ // io.once chỉ load duy nhât một lần khác với io.on mỗi lần load trang là 1 làn load connection
        socket.on("CLIENT_SEND_MESSAGE",async (data)=>{
            let images = [];
            
            for (const imageBufer of data.images) {
                const link = await uploadToCloudinary(imageBufer);
                   
                images.push(link);
            }
        
            
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
}