const express = require('express')
const router = express.Router();
const controller = require("../../controller/client/user.controller");
const userValidate = require("../../validates/client/user.validate");
router.get('/register',controller.register);
router.post('/register',userValidate.registerPost,controller.registerPost);
router.get('/login',controller.login);
router.post('/login',userValidate.loginPost,controller.loginPost);
router.get("/logout",controller.logout);
module.exports = router
