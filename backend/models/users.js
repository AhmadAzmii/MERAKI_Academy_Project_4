const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usersSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  phoneNumber:{type:Number,required:true},
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  image: { type: String },
  userName: { type: String, required: true },
  age: { type: Number,min:18,max:66,required:true },
  speciality :{type:String}
});

usersSchema.pre("save", async function () {
  this.email = this.email.toLowerCase();
  this.password = await bcrypt.hash(this.password, 10);
});



module.exports = mongoose.model("Users", usersSchema);
