const { request } = require('express')
const multer = require('multer')
const uuid = require('uuidv4')


const videoStorage = multer.diskStorage({

    destination : 'Videos',
    filename : (req,file,cb) => {

        const id = uuid.uuid()
        const token = req.token
        const filename = `${token._id.toString()}-${id}.mp4`
        req.filename = filename
        cb(null,filename)

    }
})

const videoupload = multer({

    storage:videoStorage,
    limits:{

        fileSize:90000000 * 5
    },
    fileFilter:(request,file,cb) => {

        
        if(!file.originalname.match(/\.(mp4|MPEG4|mkv)$/)){

            
            return cb(new Error('Video format not supported'))
        }

        cb(undefined,true)


    }
})


module.exports = videoupload