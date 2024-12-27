const mongoose = require("mongoose")
const newusersSchema = new mongoose.Schema({
  name:{
    type:String,
  },
  age:{
    type:Number,
  },
  city:{
    type:String,
  },
  email: {
    type: String,
    required: true,
},
phone: {
    type: String,
    required: true,
},

  mypic: {
    type:String,
  },
  password:{
    type:String, 
  },
  status:{
    type:Number
  }
})

const newusersModel = mongoose.model("newusers", newusersSchema)
module.exports = newusersModel