const express = require("express")


const { register, login,getAllUsers,googleLogin } = require("../controllers/users")

const usersRouter = express.Router()

usersRouter.post("/register", register)
usersRouter.post("/login", login)
usersRouter.get("/",getAllUsers)

usersRouter.post('/google-login',googleLogin)
module.exports = usersRouter