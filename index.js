const express= require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const path = require("path");// lấy đường dẫn
const favicon = require('serve-favicon');
const routerAdmin = require("./routes/admin/index.route")
const router = require("./routes/client/index.route");
const flash = require("express-flash") // import thư viện dùng để hiển thị thông báo
const cookieParser = require("cookie-parser"); //import đi kèm để sử dụng package flash
const session = require("express-session")//import đi kèm để sử dụng package flash
const systemConfig = require('./config/system')
const database = require("./config/database")
const methodOverride = require('method-override')//import dùng để ghi đè lên phương thức của form trong html
const bodyParser = require('body-parser'); //import body-parser
const moment = require('moment');
const http = require("http");
const {Server} = require("socket.io");



database.connet();

app.use(favicon(path.join(__dirname, 'public', 'uploads', 'favicon.ico')));

app.set("view engine","pug");
//nên sẽ cần __dirname 
app.set("views",`${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))// biến public này chỉ được hiểu trên local nhưng trên online thì sẽ không hiểu thư mục này

app.use(express.json());

//socketio 
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
//end socketio


//methodOverride
app.use(methodOverride('_method'));// sử dụng method-override để ghi đè lên method của thẻ form (mặc định chỉ có 2 phương thức:get và post )

//flash
app.use(cookieParser("werhwerhsdfh"));
app.use(session({cookie:{maxAge:60000}}));
app.use(flash());
//end flash


//tiny MCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// parse application/x-www-form-urlencode
app.use(bodyParser.urlencoded({extended:true})); 
app.use(bodyParser.json())
//trường hợp này dùng để cập nhật trạng thái đến database nên sẽ sử dụng phương thức patch



//App local variables : tao ra 1 bien local su dung cho toan ung dung, chỉ sử dụng cho file .pug mà thôi 
app.locals.prefixAdmin = systemConfig.prefixAdmin; 
app.locals.moment = moment;

//Routes
routerAdmin(app);
router(app);
app.get("*",(req,res)=>{
    res.render("client/pages/error/404",{
        pageTitle:"404 Not fount"
    })
})

server.listen(port,()=>{
    console.log(`Da chay server voi cong ${port}`);
})