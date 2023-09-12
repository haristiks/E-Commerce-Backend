const express=require('express')
const userRouter=express.Router()
const userController=require("../controllers/userController")
const TryCatch=require("../middlewares/tryCatchMiddleware")

userRouter.post('/register',TryCatch)
userRouter.post('/login',TryCatch)
userRouter.get('/products',TryCatch)
userRouter.get('/products/:id',TryCatch)
userRouter.get('/products/category/:categoryname',TryCatch)
userRouter.post('/:id/cart',TryCatch)
userRouter.get('/:id/cart',TryCatch)
userRouter.post('/id/wishlist',TryCatch)
userRouter.get('/:id/wishlist',TryCatch)
userRouter.delete('/:id/wishlist',TryCatch)


module.exports=userRouter