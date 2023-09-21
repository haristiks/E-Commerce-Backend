const multer = require("multer");
const uploader= multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 500000 }
  });
const cloudinary = require("./cloudinary");


const upload = (req,res,next) => {
   
    uploader.single("image")(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
    
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded." });
        }
    
        try {
          const result = await cloudinary.uploader.upload(req.file.buffer, {
            folder: "product-images", // Replace with your desired folder name
          });
    
          req.body.image = result.secure_url;
          next();
        } catch (error) {
          return res.status(500).json({ message: "Error uploading file to Cloudinary." });
        }
      });
};

module.exports = upload;
