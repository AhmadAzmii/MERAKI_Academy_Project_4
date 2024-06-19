const express = require("express")
const authentication = require("../middleware/authentication")
const authorization = require("../middleware/authorization")

const { register, login,getAllUsers,googleLogin,deleteUserById,getUserById,updateUser } = require("../controllers/users")

const usersRouter = express.Router()

usersRouter.put("/:id",updateUser)
usersRouter.get("/:id",getUserById)
usersRouter.delete("/:id", authentication, authorization("everything"),deleteUserById)
usersRouter.post("/register", register)
usersRouter.post("/login", login)
usersRouter.get("/",getAllUsers)

usersRouter.post('/google-login',googleLogin)
module.exports = usersRouter    