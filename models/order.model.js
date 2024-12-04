const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
   {
    // user_id:String,
    cart_id:String,
    userInfo:{
        fullname:String,
        phone:String,
        address:String
    }, 
    product:[
       {
        product_id:String,
        price:Number,
        discountPercent:Number,
        quantity:Number
    }
    ],
    deleted:{
        type:Boolean,
        default:false
    },
    deletedAt:Date,
},
{
    timestamps:true
}
)
const Order = mongoose.model("Order",orderSchema,"orders");
module.exports = Order;