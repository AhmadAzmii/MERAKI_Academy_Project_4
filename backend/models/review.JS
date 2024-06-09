const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, reF: "Users", required: true },
    review: { type: String, required: true },
    date: { type: Date, default: Date.now },
    rating: { type: Number, require: true, min: 0, max: 5 }
})

module.exports = mongoose.model("Review", reviewSchema)