const videoMoel = require('../Models/Video.mode')
const fs = require("fs")
const { request } = require('https')
const formidable = require('formidable')
const viewModel = require('../Models/Video.mode')
const usermodel = require('../Models/User.model')
const commentModel = require('../Models/Comments')
const IncomingForm = require('formidable')
const { json, response } = require('express')
const  ipinfo = require("ip-info-finder");
const Playlist = require('../Models/PlaylistModel')
const PlaylistModel = require('../Models/PlaylistModel')
const e = require('express')
const path = require('path')
const multer = require('multer')
const likemodel = require("../Models/LIkes.model")
const jwt = require('jsonwebtoken')




class VideoController{


   async  upload(request,response){


        const newVideo = new videoMoel({

            owner:request.token._id,
            name:request.body.name,
            videopath: request.filename,
           

        })

        const likes = new likemodel({

            owner:request.token._Id,
            likes:0
        })
    
        try{
        const savevideo = await newVideo.save()
        const savelikes = await likes.save()
        response.status(201).json({

            msg:"Video uploaded successful",
            id:savevideo.id
        })
        }
        catch(err){

            console.log(err)

            response.status(500).json({

                msg:"Video uploadeding failed"
            })

        }

    }



 

   async UploadThumbnail(request,response){


        const id = request.body.id
        const imagename = request.body.imagename
        const thumbnailpath = request.filename
        
        console.log(id)

        if(imagename==null){

            return response.status(400).json({msg:"Image name is required to update name of image"})
        }



        console.log(request.filename)

        try{
        videoMoel.findOneAndUpdate({_id:id},{$set:{thumbnailpath:thumbnailpath,imagename:imagename}},({new:true,strict:false}),(err,doc)=>{


        

                if(err){

                    response.status(500).send({
                        msg:"Something went wrong failed to upload"
                    })
                }
                else{

                  
                    response.status(201).send({
                        msg:"Thumbnail upload success",
                  
                    })

                    console.log(doc)
                
                }
            

         



            console.log(id)
            console.log(thumbnailpath)
        })


        

    }
    catch(err){

        console.log(err)
        response.status(500).send({
            message:"Something went wrong failed to upload"
        })
    }
       
    
    }


  async getimage(request,response){

        
        const id = request.token._id
        const ID = request.params.id

        console.log(ID)
    
        var prevFolder= path.basename(path.dirname("src"));
        const imgdata = await videoMoel.findOne({_id:ID})
        const imagepath = path.join(prevFolder,"Images",imgdata.thumbnailpath)
        console.log(imagepath)
        fs.exists(imagepath, function (exists) {
 
            if (!exists) {
                response.writeHead(404, {
                    "Content-Type": "text/plain" });
                response.end({msg:"404 Not Found"});
                return;
            }

            var action = imgdata.thumbnailpath;
     
            // Extracting file extension
            var ext = path.extname(action);
     
            // Setting default Content-Type
            var contentType = "text/plain";
     
            // Checking if the extension of
            // image is '.png'
            if (ext === ".png") {
                contentType = "image/png";
            }

            if (ext === ".jpg") {
                contentType = "image/jpg";
            }

     
            // Setting the headers
            response.writeHead(200, {
                "Content-Type": contentType });
     
            // Reading the file
            fs.readFile(imagepath,
                function (err, content) {
                    // Serving the image
                    response.end(content,'base64');
                });
        });


    }


    Stream(request,response){

        // const ip = request.params.ip

        // console.log(ip)

        // ipinfo.getIPInfo(ip).then(data=>{

        //     console.log(data)
        // })

        const videopath = `Videos/${request.params.name}`
        const videosize = fs.statSync(videopath).size

        let range = request.headers.range

       

        if(range){

            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10): videosize-1;
            const chunksize = 10**6
            const contentlenght = end - start+1
            const headers = {
    
                "Content-Lenght":chunksize,
                "Accept-Ranges":"bytes",
                "Content-Type":"video/mp4",
                "Content-Range":`bytes ${start}-${end}/${videosize}`
            
            }
    
            response.writeHead(206,headers)
            const videostream = fs.createReadStream(videopath,{start,end})
            videostream.pipe(response)
        }
        else{

            const head = {

                'Content-Length': videosize,
                
                'Content-Type': 'video/mp4',
                
                };
                
                response.writeHead(200, head);
                
                fs.createReadStream(videopath).pipe(response);
                
        }

       


    }

    update(request,response){
       
        const form = new formidable.IncomingForm()
        form.parse(request,(error,fields,files)=>{


            if(error){

                response.status(500).send({
                    message:"Something went wrong failed to update name"
                })
            }

            const {id,name} = fields

            if(!name){

                return response.status(400).json({msg:"Video name is required to update name of video"})
            }

            videoMoel.findOneAndUpdate({_id:id},{$set :{name:name}},{new :true},(error,doc)=>{

                if(error){

                    return response.status(400).json({msg:"Video name is required to update name of video"})
                }

                return response.status(200).json({msg:"Video name updated successfully"})
            })


            

        })

        
    }

    delete(request,response){


        const video_id = request.params.video_id
        const video_path = request.params.video_path

        const videopath = `Videos/${video_path}`
        if(fs.existsSync(videopath)){

            fs.unlink(video_path,(error)=>{

                if(error){

                    return response.status(500).json({msg:"Network error failed to delete video"})
                }

                videoMoel.findByIdAndDelete({id:video_id},(error)=>{

                    if(error){

                        return response.status(500).json({msg:"Network error failed to delete video"})
                    }

                    return response.status(200).json({msg:"Video delete"})
    
                })
            })
        }

    }

     fatchVideosOfInterest(request,response){

       
        const form = new formidable.IncomingForm()
        form.parse(request,async (error,fields,files)=>{

            const {interst} = fields;

            if(error){

                console.log(error)
                return response.status(500).json({msg:"Network error failed to delete video"})
               
            }

            const data =  await videoMoel.find({likes:1})
            response.status(200).send({data})

        })
    }


    Addlikes(request,response){

        const video_id = request.params.id
        const owner_id = request.params.ownerid
        console.log(owner_id)
      

        videoMoel.findOneAndUpdate({_id:video_id},{$inc:{likes:1},$push:{likers:owner_id}},({new:true}),(error,doc)=>{


            if(error){


                return response.status(500).send({
                    msg:"Network error:failed to like video"
                })
            }

            else{

            return response.status(200).send({
                msg:"Video liked"
            })
        }
        })
    }


    unlikes(request,response){

        const video_id = request.params.id
        const owner_id = request.params.owner_id
        console.log(owner_id)
      

        videoMoel.findOneAndUpdate({_id:video_id},{$inc:{likes:-1},$pull:{likers:owner_id}},({new:true}),(error,doc)=>{





            if(error){


                console.log(error)
                return response.status(500).send({
                    msg:"Network error:failed to unlike video"
                })
            }

            else{

            return response.status(200).send({
                msg:"Video liked"
            })
        }
        })
    }


    // Addlikes(request,response){

    //     const video_id = request.params.id
    //     videoMoel.findOneAndUpdate({_id:video_id},{$inc:{likes:1}},({new:true}),(error,doc)=>{


    //         if(error){


    //             return response.status(500).send({
    //                 msg:"Netwokr error:failed to like video"
    //             })
    //         }


    //         return response.status(200).send({
    //             msg:"Video liked"
    //         })
    //     })
    // }




    dislikes(request,response){

        const video_id = request.params.id
        videoMoel.findOneAndUpdate({_id:video_id},{$inc:{dislikes:1}},({new:true}),(error,doc)=>{


            if(error){


                return response.status(500).send({
                    msg:"Netwokr error:failed to dislike video"
                })
            }


            return response.status(200).send({
                msg:"Video disliked"
            })
        })
    }


    async comment(request,response){


        const form = new formidable.IncomingForm()
        
    
        form.parse(request,async (error,fields,files)=>{

       
            const token = request.headers.authorization
        
            const TokenArray = token.split(" ");
            console.log(TokenArray[1])
            const _token = jwt.decode(TokenArray[1])
            const decoded = jwt.verify(TokenArray[1],process.env.cookie_secret);
            const user =  usermodel.findOne({_id:decoded.id})
            const username = decoded.username
            console.log(username)
        

            if(error){


                return response.status(500).send({
                    msg:"Network error:failed to dislike video"
                })
            }


            const {comment,video_id} = fields

            if(!comment || !video_id){

                console.log(comment)
                console.log(video_id)
                console.log(error)
                return response.status(400).json({msg:"All fields are required tp create a comment"})

            
            }

            

        

            const newcomment = new commentModel({

                owner:decoded.id,
                videoId:video_id,
                comment:comment,
                username:decoded.username

            })

            const savecomment = await newcomment.save()
            videoMoel.findOneAndUpdate({_id:video_id},{$push:{comments:savecomment._id}},({new:true},(error,doc)=>{


                if(error){

''
                    return response.status(500).json({msg:"Network error failed to comment on video"})
                }

                return response.status(200).json({msg:"Comment added succesfully"})
            }))
            
        })
    }



    replyComment(request,response){

        const form = IncomingForm()
        const token = request.token

        form.parse(request, async(error,fields,files)=>{

            if(error){

            
                return response.status(500).send({
                    msg:"network error failed to add comment"
                })
            }


            const {comment,comment_id} = fields

            if(!comment || !comment_id){

                return response.status(400).send({

                    msg:"All fields are required to comment"
                })
            }


            const newComment = new commentModel({

                owner:token.id,
                comment,
            })


            const savedoc = await newComment.save()
            commentModel.findOneAndUpdate({_id:comment_id},{$push:{replies:savedoc._id}},{new:true},(error,doc)=>{


                if(error){

                    return response.status(500).send({

                        msg:"Network failed to add comment"
                    })
                }

                response.status(200).send({

                    msg:"Reply was succesfully"
                })
            })



        })
    }



    async GetVideo(request,response){

        const video_id = request.params.id
        console.log(video_id)
        // const data = await videoMoel.findOne({_id:video_id})
        const data = await videoMoel.findOne({_id:video_id}).populate({
            

            path:"comments", //document path
            populate:{
                path:"replies",   //document path
                model:"comment" //same models
            }
        })



        const jsondata = {

            data:[
                data
            ]
           
        }
       
        
        console.log(jsondata)
        return response.status(200).json(jsondata)
        

    }


    // async getVideoViews(request,response){

    //     const id = request.params.id
    //     const data = await viewModel.findOne({_id:id})
    //     const totalviews = data.views.length
        
    //     const location_view_data = data.views.map((ip,idx)=>{

    //         let info
    //         ipinfo.getIPInfo(ip).then((data)=>{

    //             info = data
                
    //         }).catch((error)=>{

    //             info = {}
    //         })


    //     })

    //     console.log(location_view_data)
    //     const result = {

    //         total_views:totalviews
    //     }

    //     response.status(200).json(result)


    // }



    async createPlaylist(request,response){

        const token = request.token
        const name = request.params.name
        const newPlaylist = new PlaylistModel({


            owner:token._id,
            playlistname : name

        })


        const saveddata = await newPlaylist.save()
        return response.status(200).json({

            msg:"playlist has been created"
        })
    }


    
AddtoPlaylist(request,response){

    const token = request.token
    const video = request.params.id
    const playlistId = request.params.playlistid
    console.log(playlistId)

    PlaylistModel.findOneAndUpdate({owner:token._id,_id:playlistId},{$push:{videos:video}},{new:true},(error,doc)=>{

        if(error){

            response.status(500).json({

                msg:"Network error: Failed to add to playlist"
            })
        }
        else{

            return response.status(200).json({

                msg:"Video added to playlist"
            })
        }

       
    })

}

 
async getcomments(request,response){


   
    try{

    
        const videoid = request.params.videoid

    const allcomments = await commentModel.find({videoId:videoid})
    
     response.status(200).json({

        comments:allcomments

    })

    }
    catch(err){

        console.log(err)
    }
   

}


async getallVideos(request,response){

    try{


    
        const data = await videoMoel.find()
        response.status(200).send({
            data:
                data
            
        })



    }
    catch(err){

        response.status(500).send({
            msg:"Something went wrong"
        })
        console.log(err)
    }

}

async getVideo(request,response){

    try{


        const id = request.token._id
        const data = await videoMoel.find({_id:id})
        response.status(200).send(data)
        


    }
    catch(err){

        response.status(500).send({
            msg:"Something went wrong"
        })
        console.log(err)
    }

}




}






module.exports = VideoController