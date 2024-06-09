const roleModel = require("../models/role")


const createRole = (req, res) => {
    const { role, permissions } = req.body

    const roleDb = new roleModel({
        role, permissions
    })

    roleDb
        .save()
        .then((result) => {
            res.status(201).json({
                success: true,
                message: `role created`,
            })
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: `Server Error`,
                err: err.message,
            })
        })
}

const getAllRoles = (req, res) => {
    roleModel
        .find()
        .then((result) => {
            if (result.length) {
                res.status(200).json({
                    success: true,
                    message: `All the roles`,
                    roles: result
                })
            } else {
                res.status(200).json({
                    success: false,
                    message: `No roles Yet`,
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: `Server Error`,

            })
        })
}

const getRoleById = (req, res) => {
    const id = req.params.id
    roleModel
        .findById(id)
        .then((result) => {
            if (!result) {
                res.status(404).json({
                    success: false,
                    message: `The role with id => ${id} not found`,
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: `The role ${id} `,
                    role: result,
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: `Server Error`,
                err: err.message,
            });
        })
}

const updateRoleById = (req, res) => {
    const { id } = req.params
    const updatedRole = req.body
    roleModel
        .findOneAndUpdate({ _id: id }, updatedRole)
        .then((result) => {
            if (result) {
                res.status(200).json({
                    success: true,
                    message: "role updated",
                    role: updatedRole
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    message: `The role with id => ${id} not found`,
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: "Server Error",
                err: err.message
            })
        })
}

const deleteRoleById = (req, res) => {
    const { id } = req.params
    roleModel
        .findOneAndDelete({ _id: id })
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `The role with id => ${id} not found`,
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: `Role deleted`,
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: "Server Error",
                err: err.message
            })
        })
}


module.exports = { createRole, getAllRoles, getRoleById, updateRoleById, deleteRoleById }