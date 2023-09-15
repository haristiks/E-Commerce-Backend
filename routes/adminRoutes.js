const express=require('express')
const adminRouter=express.Router()
const adminController=require("../controllers/adminController")
const verifyToken=require("../middlewares/adminAuthMiddleware")
const TryCatch=require("../middlewares/tryCatchMiddleware")

adminRouter.use(express.json())

adminRouter.post('/login',TryCatch(adminController.login))
adminRouter.get('/users',verifyToken,TryCatch(adminController.getallusers))
adminRouter.get('/users/:id',verifyToken,TryCatch(adminController.getuserByid))
adminRouter.get('/products/',verifyToken,TryCatch(adminController.getallProducts))
adminRouter.get('/products?category=men',verifyToken,TryCatch(adminController.getProductsByCatogory))
adminRouter.get('/products/:id',verifyToken,TryCatch(adminController.getProductByid))
adminRouter.post('/products',verifyToken,TryCatch(adminController.createProduct))
// adminRouter.put('/products',verifyToken,TryCatch)
// adminRouter.delete('/products',verifyToken,TryCatch)

module.exports=adminRouter