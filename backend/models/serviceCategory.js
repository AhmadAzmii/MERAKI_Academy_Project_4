const mongoose = require("mongoose")


const serviceCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }

})

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema)