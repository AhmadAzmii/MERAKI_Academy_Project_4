const categoryModel = require("../models/serviceCategory")


const createNewCategory = (req, res) => {
    const { name, description } = req.body

    const categoryDb = new categoryModel({
        name, description
    })
    categoryDb
        .save()
        .then((result) => {
            res.status(201).json({
                success: true,
                message: `category created`,
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

const getAllCategories = (req, res) => {
    categoryModel
        .find()
        .then((result) => {
            if (result.length) {
                res.status(200).json({
                    success: true,
                    message: `All the categories`,
                    categories: result
                })
            } else {
                res.status(200).json({
                    success: false,
                    message: `No categories Yet`,
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

const getCategoryById = (req, res) => {
    const id = req.params.id
    categoryModel
        .findById(id)
        .then((result) => {
            if (!result) {
                res.status(404).json({
                    success: false,
                    message: `The category with id => ${id} not found`,
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: `The category ${id} `,
                    category: result,
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

const updateCategoryById = (req, res) => {
    const { id } = req.params
    const updatedCategory = req.body
    categoryModel
        .findOneAndUpdate({ _id: id }, updatedCategory)
        .then((result) => {
            if (result) {
                res.status(200).json({
                    success: true,
                    message: "category updated",
                    category: updatedCategory
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    message: `The category with id => ${id} not found`,
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

const deleteCategoryById = (req, res) => {
    const { id } = req.params
    categoryModel
        .findOneAndDelete({ _id: id })
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `The category with id => ${id} not found`,
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: `category deleted`,
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

module.exports = { createNewCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById }