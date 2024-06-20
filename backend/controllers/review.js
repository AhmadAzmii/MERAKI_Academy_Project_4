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
const deleteReviewById=(req,res)=>{
    const {id}=req.params
    reviewModel
    .findOneAndDelete({_id:id})
    .then((result)=>{
        if (!result) {
            return res.status(404).json({
                success: false,
                message: `review with id => ${id} not found`,
            });
        } else {
            res.status(200).json({
                success: true,
                message: `review deleted`,
            });
        }
    })
    .catch((err)=>{
        res.status(500).json({
            success: false,
            message: "Server Error",
            err: err.message
        })
    })
}
const updateReviewById=(req,res)=>{
    const {id}=req.params
    const updatedReview=req.body
    reviewModel
    .findOneAndUpdate({_id:id},updatedReview)
    .then((result)=>{
        if (result) {
            res.status(200).json({
                success: true,
                message: "review updated",
                review: updatedReview
            })
        }
        else {
            res.status(404).json({
                success: false,
                message: `The review with id => ${id} not found`,
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
module.exports = {
    createNewReview,deleteReviewById,updateReviewById
};
