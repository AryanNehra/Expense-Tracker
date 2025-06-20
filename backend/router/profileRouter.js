const express=require('express')
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });
const auth=require('../middleware/auth')
const profileRouter=express.Router();

const profileController=require('../controllers/profileController')

profileRouter.use(auth);

profileRouter.get('/',profileController.getProfile);
profileRouter.put('/',upload.single('profilePhoto'),profileController.updateProfile);
profileRouter.put('/change-password',profileController.changePassword);

module.exports=profileRouter;
