const express = require("express")
const authentication = require("../middleware/authentication")
const authorization = require("../middleware/authorization")

const { register, login,getAllUsers,googleLogin,deleteUserById,getUserById,updateUser ,forgotPassword,verifyOtp,resetPassword,getUserInfo} = require("../controllers/users")

const usersRouter = express.Router()

usersRouter.put("/:id",updateUser)
usersRouter.get("/:id",getUserById)
usersRouter.delete("/:id", authentication, authorization("everything"),deleteUserById)
usersRouter.post("/register", register)
usersRouter.post("/login", login)
usersRouter.get("/",getAllUsers)
usersRouter.post('/forgot-password', forgotPassword);
usersRouter.post('/verify-otp', verifyOtp);
usersRouter.post('/reset-password', resetPassword);
usersRouter.get('/:id',getUserInfo)
usersRouter.post('/google-login',googleLogin)
module.exports = usersRouter    