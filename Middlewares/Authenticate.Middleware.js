const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { request } = require('express')
dotenv.config()

const auth = (request,response,next) => {

    const token = request.headers.authorization.split(' ')[1];

    console.log(process.env.cookie_secret)

    jwt.verify(token,process.env.cookie_secret,function(err,decode){

        if(err){

            console.log(decode)
            return response.status(400).json({json:`signup or sigin to upload videos ${err}`})
            
        }

        request.token = decode
        console.log(request.token)
        next()
    })



}


module.exports = auth