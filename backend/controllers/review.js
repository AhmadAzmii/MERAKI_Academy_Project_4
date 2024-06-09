const reviewModel = require("../models/review");
const providerInfoModel = require("../models/serviceProviderInfo");

const createNewReview = (req, res) => {
    const id = req.params.id;
    const { customer, review, date, rating } = req.body;
    const reviewDb = new reviewModel({
        customer,
        review,
        date,
        rating,
    });
    reviewDb
        .save()
        .then((result) => {
            providerInfoModel
                .findByIdAndUpdate(
                    { _id: id },
                    { $push: { reviews: result._id } },
                    { new: true }
                )
                .then(() => {
                    res.status(201).json({
                        success: true,
                        message: `review added`,
                        review: result,
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        success: false,
                        message: `Server Error`,
                        err: err.message,
                    });
                });
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
    createNewReview,
};
