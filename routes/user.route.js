import { Router } from 'express'
import { avatarController, forgotPasswordController, loginController, logoutController, refreshTokenController, registerUserController, resetPasswordController, updateUserDetails, userDetailsController, verifyEmailController, verifyForgotPasswordOtp } from '../controllers/user.controller.js';
import auth from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const userRouter = Router();

userRouter.post("/register",registerUserController)
userRouter.post("/verify-email",verifyEmailController)
userRouter.post("/login",loginController)
userRouter.get('/logout',auth,logoutController)
userRouter.put('/upload-avatar',auth,upload.single('avatar'),avatarController)
userRouter.put('/update-user',auth,updateUserDetails)
userRouter.put('/forgot-password',forgotPasswordController)
userRouter.put('/verify-forgot-password-otp',verifyForgotPasswordOtp)
userRouter.put('/reset-password',resetPasswordController)
userRouter.post('/refresh-token',refreshTokenController)
userRouter.post('/user-details',auth,userDetailsController)

export default userRouter;