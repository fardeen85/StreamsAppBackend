const express = require('express')
const { Server } = require('http')
const app = express()
require("./conn")
const authroutes = require('./Routes/Auth.router')
const cors = require('cors')
const videroutes = require('./Routes/VideoRoutes')
const { response } = require('express')
const helmet  = require('helmet')
const path = require('path')
const ip = require('ip')





const port = process.env.PORT ?? 5000

app.use(authroutes)
app.use(cors())
app.use(videroutes)
app.use(express.json())
app.use(helmet())
app.use(express.static("Videos"))
console.log(path.join(__dirname,"Videos"))
//changes here
//and here
//and here
app.listen(port,()=>{

    console.log(`Server listening at ${port}`)
    console.dir ( ip.address() );
})



