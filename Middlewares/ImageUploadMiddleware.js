const multer = require('multer');
const imagestorage = require('../Middlewares/Image.middleware');

const imageuploadMiddleware = (req,res,next)=>{
  
  const upload = imagestorage.single('thumbnailpath');

  // Here call the upload middleware of multer
  upload(req, res, function (err) {
     if (err instanceof multer.MulterError) {
       // A Multer error occurred when uploading.
     
       console.log(req.Error)
       res.send({

        msg:"File size too large"
       })
       next(err)
       } else if (err) {
       // An unknown error occurred when uploading.
       const err = new Error('Server Error')
       next(err)
     }

    // Everything went fine.
    next()
  })

}

module.exports = imageuploadMiddleware