const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usersSchema = new mongoose.Schema({
  firstName: { type: String,  },
  lastName: { type: String, },
  email: { type: String, required: true, unique: true },
  password: { type: String,  },

  phoneNumber: { type: String,  unique: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  image: { type: String },  
  userName: { type: String,  },
  age: { type: Number, min: 18, max: 66, },
  specialist: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCategory" }
});

usersSchema.pre("save", async function () {
  this.email = this.email.toLowerCase();
  this.password = await bcrypt.hash(this.password, 10);
});



module.exports = mongoose.model("Users", usersSchema);
