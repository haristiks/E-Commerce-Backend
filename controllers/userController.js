const mongoose = require("mongoose");
const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const jwt = require("jsonwebtoken");
mongoose.connect("mongodb://0.0.0.0:27017/E-Commerce-Bakend", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  //
  // Create a user with name, email, username (POST api/users/register)
  //
  createuser: async (req, res) => {
    const { name, email, username } = req.body;
    await User.create({
      name: name,
      email: email,
      username: username,
    });
    res.status(200).json({
      status: "success",
      message: "user registration successfull.",
    });
  },
  //
  //User login    (POST api/users/login)
  //
  userLongin: async (req, res) => {
    const { username, password } = req.body;

    const user = User.findOne({ username: username, password: password });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const token = jwt.sign(
      { username: user.username },
      process.env.USER_ACCESS_TOKEN_SECRET
    );
    res
      .status(200)
      .json({ status: "success", message: "Login successful", data: token });
  },
  //
  //  get arrays of object which contain products details.  (GET api/users/products)
  //
  productList: async (req, res) => {
    const productList = await Product.find();
    res.status(200).json({
      status: "success",
      message: "Successfully fetched product data",
      data: productList,
    });
  },
  //
  // get a product details as a json object.   (GET api/users/products/:id)
  //
  productById: async (req, res) => {
    const id = req.params.id;
    const productById = await Product.findById(id);
    if (!productById) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Successfully fetched product details.",
      data: productById,
    });
  },
  //
  // get list of  products based on category (GET api/users/products/category/:categoryname)
  //
  ProductByCategory: async (req, res) => {
    const Category = req.params.categoryname;
    const products = await Product.find({ category: Category });
    if (!products) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Successfully fetched category details.",
      data: products,
    });
  },
  //
  // user add product to cart    (POST api/users/:id/cart)
  //
  addToCart: async (req, res) => {
    const userId = req.params.id;
    console.log(req.body.productId);
    const product = await Product.findById(req.body.productId);
    console.log(product);
    await User.updateOne({ _id: userId }, { $push: { cart: product } });
    res.status(200).json({
      status: "success",
      message: "Successfully added product to cart.",
    });
  },
  //
  // user remove cart items   (DELETE api/users/:id/cart)
  //
  deleteCart: async (req, res) => {
    const userId = req.params.id;
    const product = await Product.findById(req.body.productId);
    await User.updateOne({ _id: userId }, { $pull: { cart: product } });
    res.status(200).json({
      status: "success",
      message: "Successfully deleted product from Cart.",
    });
  },
  //
  // show cart items   (GET api/users/:id/cart)
  //
  showCart: async (req, res) => {
    const userId = req.params.id;
    const cart = await User.find({ _id: userId }, { cart: 1 });
    if (!cart) {
      return res.status(404).json({ error: "Nothing to show on Cart" });
    }
    res.status(200).json({
      status: "success",
      message: "Successfully fetched cart details.",
      data: cart,
    });
  },
  //
  // add product to wishlist   (POST api/users/:id/wishlists/)
  //
  addTowishlist: async (req, res) => {
    const userId = req.params.id;
    console.log(req.body.productId);
    const product = await Product.findById(req.body.productId);
    console.log(product);
    await User.updateOne({ _id: userId }, { $push: { wishlist: product } });
    res.status(200).json({
      status: "success",
      message: "Successfully added product to wishlist.",
    });
  },
  //
  // show wishlist   (GET api/users/:id/wishlists)
  //
  showWishlist: async (req, res) => {
    const userId = req.params.id;
    const wishlist = await User.find({ _id: userId }, { wishlist: 1 });
    if (!wishlist) {
      return res.status(404).json({ error: "Nothing to show on wishlist" });
    }
    res.status(200).json({
      status: "success",
      message: "Successfully fetched cart details.",
      data: wishlist,
    });
  },
  //
  //  delete wishlist  (DELETE api/users/:id/wishlists)
  //
  deleteWishlist: async (req, res) => {
    const userId = req.params.id;
    const product = await Product.findById(req.body.productId);
    await User.updateOne({ _id: userId }, { $pull: { wishlist: product } });
    res.status(200).json({
      status: "success",
      message: "Successfully deleted product from wishlist.",
    });
  },
};
