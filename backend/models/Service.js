const mongoose=require("mongoose")

const serviceSchema = new mongoose.Schema({
    serviceProvider:{type:mongoose.Schema.Types.ObjectId,ref:"Users",required:true},
    customer:{type:mongoose.Schema.Types.ObjectId,ref:"Users", required: true},
    serviceInfo:{type:mongoose.Schema.Types.ObjectId,ref:"Users", required: true},
    status:{type:String, enum:['Pending', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    scheduledDate:{type:Date,required:true},
    completedDate:{type:Date},
    rating: { type: Number, min: 0, max: 5 }
})

module.exports=mongoose.model("Service",serviceSchema)