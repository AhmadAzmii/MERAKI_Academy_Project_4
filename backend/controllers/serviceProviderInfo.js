const providerInfoModel = require("../models/serviceProviderInfo")

const createNewProviderInfo = (req, res) => {
    const { title, description, rate, image, specialist, experience, availability, createdAt, updatedAt } = req.body
const userId = req.token.userId
    const providerDb = new providerInfoModel({
        title, author:userId, description, rate, image, specialist, experience, availability, createdAt, updatedAt
    })
    providerDb
        .save()
        .then((result) => {
            res.status(201).json({
                success: true,
                message: `service provider information created`,
                PostInfo: result
            })
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: `Server Error`,
                err: err.message,
            })
            console.log(err);
        })
}

const getAllProvidersInfo = (req, res) => {
    providerInfoModel
        .find()
        .populate("author")
        .populate({
            path: 'reviews',
            populate: {
            path: 'customer',
            },
          })
        .populate("specialist")
        .then((result) => {
            if (result.length) {
                res.status(200).json({
                    success: true,
                    message: `All the service providers information`,
                    providersInfo: result
                })
            } else {
                res.status(200).json({
                    success: false,
                    message: `No service providers Yet`,
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

const getProviderInfoById = (req, res) => {
    const { id } = req.params;
    providerInfoModel
        .findById({ _id: id })
        .populate("author")
        .populate({
            path: 'reviews',
            populate: {
                path: 'customer',
            },
        })
        .populate("specialist")
        .then((result) => {
            if (!result) {
                res.status(404).json({
                    success: false,
                    message: `The provider information with id => ${id} not found`,
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: `The provider information with id => ${id}`,
                    providerInfo: result,
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: `Server Error`,
                err: err.message,
            });
        });
}


const updateProviderInfoById = (req, res) => {
    const { id } = req.params
    const updatedProviderInfo = req.body
    providerInfoModel
        .findOneAndUpdate({ _id: id }, updatedProviderInfo)
        .then((result) => {
            if (result) {
                res.status(200).json({
                    success: true,
                    message: "service providers updated",
                    providerInfo: updatedProviderInfo
                })
            }
            else {
                res.status(404).json({
                    success: false,
                    message: `The provider information with id => ${id} not found`,
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

const deleteProviderInfoById = (req, res) => {
    const { id } = req.params
    providerInfoModel
        .findOneAndDelete({ _id: id })
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: `The provider information with id => ${id} not found`,
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: `provider information deleted`,
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
const getProviderInfoByAuthorId = (req, res) => {
    const { authorId } = req.params;
    console.log(`Author ID: ${authorId}`);
    providerInfoModel
        .find({ author: authorId })
        .populate("author")
        .populate("reviews")
        .populate("specialist")
        .then((result) => {
            if (result.length) {
                res.status(200).json({
                    success: true,
                    message: `Service provider information for author ${authorId}`,
                    providersInfo: result
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: `No service provider information found for  `,
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: `Server Error`,
                err: err.message,
            });
        });
};



module.exports = {
    getAllProvidersInfo,
    createNewProviderInfo,
    getProviderInfoById,
    updateProviderInfoById,
    deleteProviderInfoById,
    getProviderInfoByAuthorId
}