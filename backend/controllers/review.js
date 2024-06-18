const reviewModel = require("../models/review");
const providerInfoModel = require("../models/serviceProviderInfo");

const createNewReview = async (req, res) => {
    try {
        const id = req.params.id;
        const { customer, review, date, rating } = req.body;

        const reviewDb = new reviewModel({
            customer,
            review,
            date,
            rating,
        });

        const savedReview = await reviewDb.save();

        const populatedReview = await reviewModel
            .findById(savedReview._id)
            .populate("customer");

        await providerInfoModel.findByIdAndUpdate(
            { _id: id },
            { $push: { reviews: populatedReview._id } },
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: "Review added",
            review: populatedReview,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            err: err.message,
        });
    }
};

module.exports = {
    createNewReview,
};
