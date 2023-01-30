const mongoose = require('mongoose')

const videoschema = mongoose.Schema({


    owner:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    name:{

        type:String,
        required:[true,"Video name is required to upload video"]
    },

    videopath:{


        type:String,
        required:[true,"Video path is required to upload video"]
    },



    thumbnailpath:{

        type:String,
        default:"thumbnail"
    },

    imagename:{

        type:String,
        default:"imagename"
    },

    likes:{

        type:Number,
        default:0,

    },

    dislikes:{

        type:Number,
        default:0
    },

    

    views:{

        type:Array,
        default:[]
    },


    likers:{

        type:Array,
        unique:true,
        default:[]
    },

    comments:{

        type:Array,
        ref:"comment",
        default:[]
    }
})


const viewModel = mongoose.model('video',videoschema)
module.exports = viewModel