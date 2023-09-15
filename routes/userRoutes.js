const express=require('express')
const userRouter=express.Router()
const userController=require("../controllers/userController")
const verifyToken=require("../middlewares/userAuthMiddleware")
const TryCatch=require("../middlewares/tryCatchMiddleware")

userRouter.post('/register',TryCatch(userController.createuser))
userRouter.post('/login',TryCatch(userController.userLongin))
userRouter.get('/products',verifyToken,TryCatch(userController.productList))
userRouter.get('/products/:id',verifyToken,TryCatch(userController.productById))
userRouter.get('/products/category/:categoryname',verifyToken,TryCatch(userController.ProductByCategory))
userRouter.post('/:id/cart',verifyToken,TryCatch(userController.addToCart))
userRouter.get('/:id/cart',verifyToken,TryCatch(userController.showCart))
userRouter.delete('/:id/cart',verifyToken,TryCatch(userController.deleteCart))
userRouter.post('/id/wishlist',verifyToken,TryCatch(userController.addTowishlist))
userRouter.get('/:id/wishlist',verifyToken,TryCatch(userController.showWishlist))
userRouter.delete('/:id/wishlist',verifyToken,TryCatch(userController.deleteWishlist))


module.exports=userRouter