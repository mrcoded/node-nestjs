const multer = require('multer');
const path = require('path');

//upload middleware
//set mutler storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"))
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  }
})


//file filter function
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Please upload only images"), false)
  }
}

module.exports = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 //5MB file size
  }
})