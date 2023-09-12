const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  cart: Array,
  wishlist:Array,
  orders:Array
});

module.exports=mongoose.model('User',userSchema);