const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  cart: [{type:mongoose.Schema.ObjectId,ref:"Product"}],
  wishlist:[{type:mongoose.Schema.ObjectId,ref:"Product"}],
  orders:[]
});

module.exports=mongoose.model('User',userSchema);