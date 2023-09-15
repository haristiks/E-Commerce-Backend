require("dotenv").config()
const express=require("express")
const app=express()
const port=8000;
const adminRoute=require("./routes/adminRoutes")
const userRoute=require("./routes/userRoutes")

app.use(express.json())
app.use('/api/admin',adminRoute)
app.use('/api/users',userRoute)

app.listen(port,(err)=>{
    if (err) {
        console.log(err);
    }
    console.log("Server Running at port: "+port);
})