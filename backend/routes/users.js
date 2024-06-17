const express = require("express")
const authentication = require("../middleware/authentication")
const authorization = require("../middleware/authorization")

const { register, login,getAllUsers,googleLogin,deleteUserById } = require("../controllers/users")

const usersRouter = express.Router()

usersRouter.delete("/:id", authentication, authorization("everything"),deleteUserById)
usersRouter.post("/register", register)
usersRouter.post("/login", login)
usersRouter.get("/",getAllUsers)

usersRouter.post('/google-login',googleLogin)
module.exports = usersRouter    