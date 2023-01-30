
const multer = require('multer');
const uuid = require('uuidv4')


const storage = multer.diskStorage({
    destination: "Images",
    filename: function (req, file, callback) {
      
      const id = uuid.uuid()
      const token = req.token
      const filename = `${file.originalname}`
      req.filename = filename
      callback(null,filename)
    }

    
  });


  const filesize = 1000000 * 5
  const imageupload = multer({

    storage:storage,
    limits:{

        fileSize:filesize
    },
    fileFilter:(request,file,cb) => {

        
        if(file.size > filesize){

            cb(null,false)
            console.log(file.size)
            return cb(new Error('File too large'))
        }

        cb(undefined,true)


    }
})

module.exports = imageupload