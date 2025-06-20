const express=require('express');
const upload = require('../middleware/upload');
const authRouter=express.Router();

const authController=require('../controllers/authController');

authRouter.post('/register', upload.single('profilePhoto'), authController.postRegister);
authRouter.post('/login',authController.postLogin);


module.exports = authRouter;