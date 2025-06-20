const express=require('express')
const upload = require('../middleware/upload');
const auth=require('../middleware/auth')
const profileRouter=express.Router();

const profileController=require('../controllers/profileController')

profileRouter.use(auth);

profileRouter.get('/',profileController.getProfile);
profileRouter.put('/',upload.single('profilePhoto'),profileController.updateProfile);
profileRouter.put('/change-password',profileController.changePassword);

module.exports=profileRouter;
