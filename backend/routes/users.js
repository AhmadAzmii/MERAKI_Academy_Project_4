const express = require("express")

const { register, login,getAllUsers } = require("../controllers/users")

const usersRouter = express.Router()

usersRouter.post("/register", register)
usersRouter.post("/login", login)
usersRouter.get("/",getAllUsers)
module.exports = usersRouter