const mongoose = require("mongoose");
const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const jwt = require("jsonwebtoken");
const {joiUserSchema}=require("../models/validationSchema")
const bcrypt=require("bcrypt")
mongoose.connect("mongodb://0.0.0.0:27017/E-Commerce-Bakend", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  //
  // Create a user with name, email, username (POST api/users/register)
  //
  createuser: async (req, res) => {
    const {value,error}=joiUserSchema.validate(req.body);
    const { name, email, username, password } = value;
    if (error) {
      res.json(error.message)
    }
    await User.create({
      name: name,
      email: email,
      username: username,
      password:await bcrypt.hash(password,10)
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
    const {value,error}=joiUserSchema.validate(req.body);
    const { username, password } = value;
    if (error) {
      res.json(error.message)
    }
    const user = User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const checkPass=await bcrypt.compare(password,user.password)
    if (!checkPass) {
      res.json("password incorrect")
    }
    const token = jwt.sign(
      { username: user.username },
      process.env.USER_ACCESS_TOKEN_SECRET,{
        expiresIn: 86400,
      }
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
    const productId=req.body.productId
    // const product = await Product.findById(productId);
    await User.updateOne({ _id: userId }, { $push: { cart: productId } });
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
    const productId=req.body.productId
    // const product = await Product.findById(req.body.productId);
    await User.updateOne({ _id: userId }, { $pull: { cart: productId } });
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
    const cart = await User.findOne({ _id: userId }).populate("cart");
    if (!cart) {
      return res.status(404).json({ error: "Nothing to show on Cart" });
    }
    res.status(200).json({
      status: "success",
      message: "Successfully fetched cart details.",
      data: cart.cart,
    });
  },
  //
  // add product to wishlist   (POST api/users/:id/wishlists/)
  //
  addTowishlist: async (req, res) => {
    const userId = req.params.id;
    const productId = req.body.productId
    await User.updateOne({ _id: userId }, { $addToSet: { wishlist: productId } }); //TODO impliment add to set operator  if alredy added throw error
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
    const wishlist = await User.find({ _id: userId }).populate("wishlist");
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
    const productId = req.body.productId;
    await User.updateOne({ _id: userId }, { $pull: { wishlist: productId } });
    res.status(200).json({
      status: "success",
      message: "Successfully deleted product from wishlist.",
    });
  },
  //
  //  user payment  (POST api/users/payment/:id)
  //
  payment: async (req, res) => {
    const stripe = require("stripe")(process.env.STRIPE_KEY_SECRET);
    const user = await User.find({ _id: req.params.id }).populate("cart");
    const cartitem = user[0].cart.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      };
    });
    console.log(cartitem);
    if (cartitem != 0) {
      const session = await stripe.checkout.sessions.create({
        line_items: cartitem,
        mode: "payment",
        success_url: `http://127.0.0.1:8000/api/users/payment/success`,
        cancel_url: `http://127.0.0.1:8000/api/users/payment/cancel`,
      });
      temp = {
        cartitem: user[0].cart,
        id: req.params.id,
        paymentid: session.id,
        amount: session.amount_total / 100,
      };

      res.send({ url: session.url });
    } else {
      res.send("user no cart item");
    }
  },
  //
  //  user payment sucess (GET api/users/payment/sucess)
  //
  sucess: async (req, res) => {
    const user = await User.find({ _id: temp.id });
    if (user.length != 0) {
      await User.updateOne(
        { _id: temp.id },
        {
          $push: {
            order: {
              product: temp.cartitem,
              date: new Date(),
              orderid: Math.random(),
              paymentid: temp.paymentid,
              totalamount: temp.amount,
            },
          },
        }
      );
      await User.updateOne({ _id: temp.id }, { cart: [] });
    }
    res.status(200).json({
      status: "success",
      message: "successfully added in order",
    });
  },
  //
  //  user payment sucess (POST api/users/payment/cancel)
  //
  cancel: async (req, res) => {
    res.json("cancel");
  },
};
