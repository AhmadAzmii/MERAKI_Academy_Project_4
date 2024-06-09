const express = require("express")

const { createRole, getAllRoles, getRoleById, updateRoleById, deleteRoleById } = require("../controllers/role")

const roleRouter = express.Router()


roleRouter.post("/", createRole)
roleRouter.get("/", getAllRoles)
roleRouter.get("/:id", getRoleById)
roleRouter.put("/:id", updateRoleById)
roleRouter.delete("/:id", deleteRoleById)

module.exports = roleRouter