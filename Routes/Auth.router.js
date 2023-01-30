const { request, response } = require('express')
const express = require('express')
const AuthController = require("../Controller/Auth.controller")
const cors = require('cors')
const imgupload = require('../Middlewares/ImageUploadMiddleware')
const imageupload = require('../Middlewares/photoUpload.Middleware')
const auth = require('../Middlewares/Authenticate.Middleware')
const photoupload = require('../Middlewares/photo.Middleware')
const photoUploadMiddleware = require('../Middlewares/photoUpload.Middleware')


const router = express.Router()
const controller = new AuthController()

router.post('/api/singup',(request,response) => {

 
    controller.Signup(request,response)
} )


router.post('/api/singin',(request,response) => {


    controller.Signin(request,response)
})

router.get('/api/test',(request,response) => {


    response.send("Goood")
})



router.post('/api/uploadprofile',photoUploadMiddleware,auth,(request,response) => {


    controller.uploadpicture(request,response)
})


router.get('/api/getprofile/:id',(request,response)=>{

    controller.getprofile(request,response)
})

router.get("/api/myprofile",(request,response)=>{

    controller.profiledata(request,response)
})





module.exports = router