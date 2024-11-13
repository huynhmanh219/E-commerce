const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");


//[GET] admin/accounts
module.exports.index = async (req,res) =>{
    const find = {
        deleted:false
    }
    const records = await Account.find(find);
    res.render(`admin/pages/accounts/index`,{
        pageTitle:"Danh Sách Tài Khoản",
        records:records
    });
}

//[GET] admin/accounts/create
module.exports.create = async (req,res) =>{

    res.render(`admin/pages/accounts/create`,{
        pageTitle:"Danh Sách Tài Khoản"
    });

}

//[POST] admin/accounts/create
module.exports.createPost = async (req,res) =>{
    
    console.log(req.body.fullname);
    const record = new Account(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}