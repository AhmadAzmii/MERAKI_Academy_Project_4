const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    review: { type: String, required: true },
    date: { type: Date, default: Date.now },
    rating: { type: Number, required: true, min: 0, max: 5 }
});

module.exports = mongoose.model("Review", reviewSchema)