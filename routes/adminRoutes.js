const express=require('express')
const adminRouter=express.Router()
const adminController=require("../controllers/adminController")
const TryCatch=require("../middlewares/tryCatchMiddleware")

adminRouter.use(express.json())

adminRouter.post('/login',TryCatch)
adminRouter.get('/users',TryCatch)
adminRouter.get('/users/:id',TryCatch)
adminRouter.get('/products/',TryCatch)
adminRouter.get('/products?category=men',TryCatch)
adminRouter.get('/products/:id',TryCatch)
adminRouter.post('/products',TryCatch)
adminRouter.put('/products',TryCatch)
adminRouter.delete('/products',TryCatch)

module.exports=adminRouter