import { Router } from "express";
import { checkAuth } from "../middlewares/checkAuth.js";
import { register, login, getMe, deleteUserCard, addNewCard, addNewAddress, clientSecret, editUserInfo, verifyEmail, sendVerificationMail } from "../controllers/UserController.js";

const router = new Router

router.post("/register", register)

router.post("/login", login)

router.get("/me", checkAuth, getMe)

router.post("/deleteUserCard", checkAuth, deleteUserCard)

router.post("/addNewCard", checkAuth, addNewCard)

router.post("/addNewAddress", checkAuth, addNewAddress)

router.get("/clientSecret", checkAuth, clientSecret)

router.post("/edit", checkAuth, editUserInfo)

router.post("/verify",  verifyEmail)

router.post("/sendVerificationMail",  sendVerificationMail)

export default router