const User = require("../../models/user.model");
const md5 = require("md5");
const generateHelper = require('../../helper/generate');
const ForgotPassword = require('../../models/forgot-password.model');
const sendMailHelper = require('../../helper/sendmail');
const Cart = require("../../models/cart.model");
const crypto = require("crypto");
//[get]/user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản"
    });
}

//[post]/user/register
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email
    });
    if (existEmail) {
        req.flash("error", "Email đã tồn tại !");
        res.redirect("back");
        return
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();

    res.cookie("tokenUser", user.tokenUser);

    res.redirect('/');

}

//[get]/user/login
module.exports.login = async (req, res) => {
    const serect = crypto.randomBytes(64).toString('hex');
    console.log("tokenSerect: ", serect);

    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản"
    });
};

//[post]/user/login
module.exports.loginPost = async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({email:email,
        deleted:false
    })    
    if(!user)
    {
        req.flash("error","Email Không tồn tại!");
        res.redirect("back");
        return
    }
    if(!md5(password) == user.password)
    {
        req.flash("error","Mật khẩu không hợp lệ");
        res.redirect("back");
        return
    }
    if(user.status === "inactive")
    {
        req.flash("error","Tài khoản đã bị khóa");
        res.redirect("back");
        return
    }
    const cart = await Cart.findOne({
        user_id:user.id
    });
    if(cart)
    {
        res.cookie("cartId",cart.id)
    }
    else
    {
      await Cart.updateOne({_id:req.cookies.cartId},{
        user_id:user.id
    })
    }
    res.cookie("tokenUser",user.tokenUser);

    res.redirect("/");
}
// module.exports.loginPost = async (req, res) => {
//     const jwt = require('jsonwebtoken');
//     const bcrypt = require('bcrypt'); // Dùng bcrypt để mã hóa mật khẩu
//     require('dotenv').config(); // Load các biến môi trường từ .env

//             const {
//                 email,
//                 password
//             } = req.body;

//             // Giả sử bạn có một mô hình User để kiểm tra người dùng
//             const user = await User.findOne({
//                 email:email,
//                 deleted:false
//             });
//             if (!user) return res.status(404).json({
//                 message: 'User not found'
//             });

//             // So sánh mật khẩu
//             const isPasswordValid = await bcrypt.compare(password, user.password);
//             if (!isPasswordValid) return res.status(401).json({
//                 message: 'Invalid credentials'
//             });

//             // Tạo token JWT
//             const token = jwt.sign({
//                 id: user._id,
//                 username: user.username
//             }, process.env.TOKEN_SECRET, {
//                 expiresIn: '1h', // Thời gian sống của token
//             });

//             res.status(200).json({token});

// }
//[get]/user/logout
module.exports.logout = async (req, res) => {

    res.clearCookie("tokenUser");
    res.clearCookie("cartId");
    res.redirect("/");
}

//[get]/user/forgot
module.exports.forgot = async (req, res) => {
    res.render("client/pages/user/forgot", {
        pageTitle: "Lấy lại mật khẩu"
    });
}

//[POST]/user/forgot
module.exports.forgotPost = async (req, res) => {
    const email = req.body.email;
    const otp = generateHelper.generateRandomNumber(8)
    const existUser = await User.findOne({
        email: email,
        deleted: false
    });
    if (!existUser) {
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return
    }

    //lưu thông tin vào db
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();


    //Nếu tồn tại email thì gửi mã otp qua email
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
    Mã otp lấy lại mật khẩu là : <b style="color:green">${otp}</b> Thời hạn sử dụng là 3 phút`;

    sendMailHelper.sendMail(email, subject, html);


    res.redirect(`/user/password/otp?email=${email}`);
}

//[GET] /user/password/otp
module.exports.otp = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp", {
        pageTitle: "Nhận mã otp",
        email: email
    })
}

//[POST] /user/password/otp
module.exports.otpPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });
    if (!result) {
        req.flash("error", "OTP Không hợp lệ");
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: email
    })
    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");

}

//[GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đổi mật khẩu"
    })
}

//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    })
    res.redirect('/');
}


//[get]/user/info
module.exports.info = async (req, res) => {

    res.render("client/pages/user/info", {
        pageTitle: "Thông tin tài khoản",
    });
}