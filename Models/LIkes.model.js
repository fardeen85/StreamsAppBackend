const mongoose = require('mongoose')
const likeschema = mongoose.Schema({

    owner:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"likes"
    },

    likes:{

        type:Number,
        default:0
    }
})


const likeModel = mongoose.model("likes",likeschema)
module.exports = likeModel