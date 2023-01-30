const mongoose = require('mongoose')

const playlistSchema = mongoose.Schema({

    owner:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },

    videos:[{
        
        

            type:mongoose.Schema.Types.ObjectId,
        ref:"video"
        
    }],

    playlistname:{

        type:String,
        required:[true,"Playlist name is required"]
    }

})

const model =mongoose.model("Playlist",playlistSchema)
module.exports = model