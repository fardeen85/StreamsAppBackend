const express = require("express")
const mongoose = require("mongoose")
const url = "mongodb+srv://fsrdeen:mongodb85@cluster0.kb6a8nd.mongodb.net/MyYoutubeApp?retryWrites=true&w=majority"
const localurl = "mongodb://127.0.0.1:27017/MyYoutubeApp"
mongoose.connect(url, {

    useNewUrlParser : true,
    useUnifiedTopology:true,
  


}).then(()=>{

    console.log("success")

}).catch((err) =>{

    console.log(err)
})
