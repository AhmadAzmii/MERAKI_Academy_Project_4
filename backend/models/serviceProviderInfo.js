const mongoose=require("mongoose")

const serviceProviderInfoSchema =new mongoose.Schema({
    title:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:"Users"},
    description:{type:String,required:true},
    rate:{type:Number,min:0,max:5},
    image:{type:String},
    specialty:{type:String},
    experience:{type:Number,required:true},
    availability:{type:String,required:true},
    reviews:{type:mongoose.Schema.Types.ObjectId,ref:"Review"},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
})

serviceProviderInfoSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  module.exports=mongoose.Model("ServiceProviderInfo",serviceProviderInfoSchema)