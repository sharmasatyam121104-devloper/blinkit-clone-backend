import { Router } from 'express'
import { avatarController, loginController, logoutController, registerUserController, verifyEmailController } from '../controllers/user.controller.js';
import auth from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const userRouter = Router();

userRouter.post("/register",registerUserController)
userRouter.post("/verify-email",verifyEmailController)
userRouter.post("/login",loginController)
userRouter.get('/logout',auth,logoutController)
userRouter.put('/upload-avatar',auth,upload.single('avatar'),avatarController)

export default userRouter;