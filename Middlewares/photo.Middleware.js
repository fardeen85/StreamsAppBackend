const { request } = require('express')
const mutler = require('multer')
const jwt = require("jsonwebtoken")
const imagestorage= mutler.diskStorage({

    destination:'Profiles',
    filename:function(req,file,callback){


        
        const token = req.headers.authorization
        const TokenArray = token.split(" ");
        const _token = jwt.decode(TokenArray[1])
        const decoded = jwt.verify(TokenArray[1],process.env.cookie_secret);
        const filename = `${decoded._id}.${file.mimetype.slice(6)}`
        console.log(file.mimetype)
        callback(null,filename)
    }
})

const filesize = 1000000 * 5
const profileupload = mutler({

    storage:imagestorage,
    limits:{
        fileSize:filesize
    },

    fileFilter:(request,file,cb)=>{

           
        if(file.size > filesize){

            cb(null,false)
            console.log(file.size+"sizse")
            return cb(new Error('File too large'))
        }

        cb(undefined,true)
    }
})

module.exports = profileupload