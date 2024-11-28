const Cart = require("../../models/cart.model");
module.exports.cartId = async (req,res,next)=>{
    console.log("chay vao");
    
    if(!req.cookies.cartId)
    {
        const cart = new Cart();
        await cart.save();
        const expiresCookies = 360 * 24 *60 *60 *1000;
        console.log(cart);
        
        // có thể lưu ip của khách hàng bằng javascript
        res.cookie("cartId",cart.id,{
            expires: new Date(Date.now() + expiresCookies)
        });
    }
    else
    {

    }

    next();
}