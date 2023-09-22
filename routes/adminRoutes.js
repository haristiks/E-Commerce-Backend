const express=require('express')
const adminRouter=express.Router()
const adminController=require("../controllers/adminController")
const verifyToken=require("../middlewares/adminAuthMiddleware")
const TryCatch=require("../middlewares/tryCatchMiddleware")
const upload=require("../middlewares/photoUpload")

adminRouter.use(express.json())

adminRouter.post('/login',TryCatch(adminController.login))
adminRouter.get('/users',verifyToken,TryCatch(adminController.getAllusers))
adminRouter.get('/users/:id',verifyToken,TryCatch(adminController.getUserByid))
adminRouter.get('/products/',verifyToken,TryCatch(adminController.getAllProducts))
adminRouter.get('/products/category',verifyToken,TryCatch(adminController.getProductsByCatogory))
adminRouter.get('/products/:id',verifyToken,TryCatch(adminController.getProductById))
adminRouter.post('/products',verifyToken,upload,TryCatch(adminController.createProduct))
adminRouter.put('/products',verifyToken,upload,TryCatch(adminController.updateProduct))
adminRouter.delete('/products',verifyToken,TryCatch(adminController.deleteProduct))
adminRouter.get('/orders',verifyToken,TryCatch(adminController.orders))
adminRouter.get('/stats',verifyToken,TryCatch(adminController.stats))

module.exports=adminRouter