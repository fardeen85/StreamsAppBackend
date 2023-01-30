const multer = require('multer');
const photoUpload = require('../Middlewares/photo.Middleware');

const photoUploadMiddleware = (req,res,next)=>{

    const upload = photoUpload.single('thumbnailpath')

    upload(req,res,function(err){

        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
          
            console.log(err)
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

 module.exports = photoUploadMiddleware