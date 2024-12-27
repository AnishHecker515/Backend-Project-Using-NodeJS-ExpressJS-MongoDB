const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
  name:{
    type:String,
  },
  email:{
    type:String,
  },
  age:{
    type:String,
  },
  city:{
    type:String,
  },
  password:{
    type:String,
  },
  
})

const userModel = mongoose.model("users", userSchema)
module.exports = userModel