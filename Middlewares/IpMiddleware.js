const { json } = require('express')
const ipinfo = require("ipinfo")
const viewModel = require('../Models/Video.mode')


const addIp = async (request,response,next)=>{

    const ip = request.params.ip
    const name = request.params.name
    const video = await  viewModel.findOne({videopath:name+"mp4"})
    console.log(video.views.length)

    console.log(ip)

    if(video.views.length == 0){

        video.views.push(ip)
        console.log(`inside con`)
        viewModel.findOneAndUpdate({videopath:name},video,{new:true},(error,doc)=>{

            if(error){

                return response.status(500).send(json({

                    msg:"failed to save IP"
                }))
        }

         return next()
        })
      
    }
    else{

        const idx = video.views.indexOf(ip)
        console.log(idx)
        if(idx === -1){

            video.views.push(ip)
            viewModel.findOneAndUpdate({videopath:name},video,{new:true},(error,doc)=>{

                if(error){
    
                    return response.status(500).send(json({
    
                        msg:"failed to save IP"
                    }))
            }

            return next()
            })

        }

        next()
    }
    
}


module.exports = addIp;
