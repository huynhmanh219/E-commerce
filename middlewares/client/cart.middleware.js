const Cart = require("../../models/cart.model");
module.exports.cartId = async (req,res,next)=>{
  
    if(!req.cookies.cartId)
    {
        const cart = new Cart();
        await cart.save();
        const expiresCookies = 360 * 24 *60 *60 *1000;
     
        // có thể lưu ip của khách hàng bằng javascript


        res.cookie("cartId",cart.id,{
            expires: new Date(Date.now() + expiresCookies)
        });
    }
    else
    {
        const cart = await Cart.findOne({
            _id:req.cookies.cartId
        })
         
        cart.totalQuantity = cart.products.reduce((sum,item)=> sum+item.quantity,0);       
        res.locals.miniCart= cart;
    }

    next();
}