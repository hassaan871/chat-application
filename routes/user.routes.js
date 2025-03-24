const express = require('express');
const user_routes = express();

const bodyParser = require('body-parser');

const session = require('express-session');
const { SESSION_SECRET } = process.env;
user_routes.use(session({ 
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
 }));

user_routes.use(bodyParser.json());
user_routes.use(bodyParser.urlencoded({ extended: true }));

user_routes.set('view engine', 'ejs');
user_routes.set('views', './views');
 
user_routes.use(express.static('public'));

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/images'));
    },
    fileName: function(req, file, cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null, name);
    }
});

const userController = require('../controllers/user.controller');

const upload = multer({ storage });

const auth = require('../middlewares/auth');

user_routes.get('/register', auth.isLogout, userController.registerLoad);
user_routes.post('/register', upload.single('image') ,userController.register);

user_routes.get('/', auth.isLogout, userController.loadLogin);
user_routes.post('/', userController.login);
user_routes.post('/logout', auth.isLogin, userController.logout);

user_routes.get('/dashboard', auth.isLogin, userController.loadDashboard);

user_routes.get('*', (req, res)=>{
    res.redirect('/');
});

module.exports = user_routes;