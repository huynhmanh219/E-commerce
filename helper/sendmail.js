const nodemailer = require('nodemailer');

module.exports.sendMail = (email,subject,html)=>{
    var transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
        }
      });
      
      var mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: subject,
        html: html
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }