const express=require('express');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });
const authRouter=express.Router();

const authController=require('../controllers/authController');

authRouter.post('/register', upload.single('profilePhoto'), authController.postRegister);
authRouter.post('/login',authController.postLogin);


module.exports = authRouter;