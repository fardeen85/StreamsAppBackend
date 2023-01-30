const mongoose = require('mongoose')

const schema = mongoose.Schema({


    owner:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user'
    },


    videoId:{

        type:mongoose.SchemaTypes.ObjectId,
        ref:'videos'
    },

    username:{

        type:String,
        
    },

    comment:{

        type:String,
        required:[true,"comment text is required to create new comment"]
    },

    likes:{

        type:Number,
        default:0
    },

    dislikes:{

        type:Number,
        default:0
    },
    replies:{

        type:mongoose.SchemaTypes.ObjectId,
        ref:"comments"
    }

})


const commentmodel = mongoose.model("comment",schema)
module.exports = commentmodel
