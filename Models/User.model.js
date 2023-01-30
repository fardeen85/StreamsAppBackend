const mongoose = require('mongoose')

const userschema = mongoose.Schema({

    username : {

        type:String,
        required:[true,"User name is required field"]
    },

    email : {

        type:String,
        required:[true,"Email is required"],
        unique:[true,"Acount already exists"]
    },

    password:{
        type:String,
        required:[true,"Password is required to create account"],
        minlength:6
    },

    Videos : {

        type:mongoose.Schema.Types.ObjectId,
        ref:"videos"
    },

    subscribers : {

        type:Array,
        default:[]
    },


    usersubscribedchannels:{

        type:Array,
        default:[]
    },

    profilephoto:{

        type:String,
        default:""
    }






})

const model = mongoose.model("user",userschema)

module.exports = model