const express = require('express')
const app = express()
const router = express.Router()
const auth = require('../Middlewares/Authenticate.Middleware')
const videoStorage = require('../Middlewares/Video.middleware')
const videocontroller = require('../Controller/VideoController')
const { request, response } = require('express')
const addIp = require('../Middlewares/IpMiddleware')
const imagestorage = require("../Middlewares/Image.middleware")
const imgupload = require('../Middlewares/ImageUploadMiddleware')


const controller = new videocontroller()

router.post('/api/video',auth,videoStorage.single('video'),(req,res)=> {



        controller.upload(req,res)
        
    
    
})


router.post('/api/image',auth,imgupload,(req,res)=>{


        controller.UploadThumbnail(req,res)
    
})


router.get('/api/video/:name',(request,response) => {

    controller.Stream(request,response)
})


router.get('/api/image/:id',auth,(request,response) => {

    controller.getimage(request,response)
})


router.patch('/api/video/update',auth,(request,response)=>{

    controller.update(request,response)

})


router.get('/api/data',auth,(request,response)=>{

    controller.fatchVideosOfInterest(request,response)

})


router.get('/api/video-like/:id/:ownerid',auth,(request,response)=>{

    controller.Addlikes(request,response)
})


router.get('/api/video-dislike/:id',auth,(request,response)=>{

    controller.dislikes(request,response)
})


router.get('/api/video-unlike/:id/:owner_id',auth,(request,response)=>{

    controller.unlikes(request,response)
})



router.post('/api/video-comment/:id',auth,(req,res)=>{

    controller.comment(req,res)
   
})


router.post('/api/reply-comment',auth,(request,response)=>{

    controller.replyComment(request,response)

})


router.get('/api/allcomments/:videoid',auth,(request,response)=>{

    controller.getcomments(request,response)
})


router.get('/api/video-data/:id',auth,(request,response)=>{

    controller.GetVideo(request,response)

})


router.get('/api/video-playlist-create/:name',auth,(request,response)=>{

    controller.createPlaylist(request,response)
})

router.get('/api/playlist-add/:id/:playlistid',auth,(request,response)=>{


    controller.AddtoPlaylist(request,response)
})

router.get(`/api/getAllvideos`,(request,response)=>{


    controller.getallVideos(request,response)
})

router.get(`/api/getvideo`,auth,(request,response)=>{


    controller.getallVideos(request,response)
})


module.exports = router
