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
  // Admin Login (POST api/admin/login)
  //
  login: async (req, res) => {
    const { username, password } = req.body;
    if (username === "admin@example.com" && password === "admin@123") {
      const token = jwt.sign(
        { username: username },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(200).json({
        status: "success",
        message: "Successfully logged In.",
        data: { jwt_token: token },
      });
    } else {
      return res.status(404).json({ error: "Not an Admin" });
    }
  },
  //
  // Get all users list (GET api/admin/users)
  //
  getallusers: async (req, res) => {
    const allusers = await User.find();
    res.status(200).json({
      status: "success",
      message: "Successfully fetched user datas.",
      data: allusers,
    });
  },
  //
  // Get a specific user based on the id provided (GET api/admin/users/:id)
  //
  getuserByid: async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Successfully fetched user data.",
      data: user,
    });
  },
  //
  // Get all products list (GET api/admin/users)
  //
  getallProducts: async (req, res) => {
    const allproducts = await Product.find();
    res.status(200).json({
      status: "success",
      message: "Successfully fetched product detail.",
      data: allproducts,
    });
  },
  //
  // Get  list of products based on the category (GET api/admin/products?category=men)
  //
  getProductsByCatogory: async (req, res) => {
    const category = req.query.category;
    const products = await Product.find({ category: category });
    if (!products) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Successfully fetched product details.",
      data: products,
    });
  },
  //
  // Get a product based on the id provided (GET api/admin/products/:id)
  //
  getProductByid: async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Successfully fetched product details.",
      data: product,
    });
  },
  //
  //Create products (POST api/admin/products)
  //
  createProduct: async (req, res) => {
    const { title, description, image, price, category } = req.body;
    await Product.create({
      title,
      description,
      price,
      image,
      category,
    });
    res.status(201).json({
      status: "success",
      message: "Successfully created a product.",
    });
  },
};
