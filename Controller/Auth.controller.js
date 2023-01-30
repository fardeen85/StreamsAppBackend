const formidable = require("formidable")
const bycrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const IncomingForm = require('formidable');
const usermodel = require("../Models/User.model");
const { json } = require("express");
require("dotenv").config();
const path = require('path')
const fs = require("fs")


class AuthController{

    
    Signup(request,response){


        const form = new IncomingForm.IncomingForm()
        form.parse(request, async (error,fields,files) => {

            if(error){

                console.log(error)
                return response.status(500).json({msg:"Network Error : failed to create account, please try again later "})
                

            }


            const {username, email, password} = fields

          

            console.log(username)
            console.log(email)
            console.log(password)
            console.log(fields)
            const salt = await bycrypt.genSalt(15)
            const hashpassword =  await bycrypt.hash(JSON.stringify(password),15)
            const newAccount = new usermodel({

                username,
                email,
                password:hashpassword
            })

            try{

                const savedAccount  = await  newAccount.save()
                console.log("Account created succesfully")
                return response.status(201).json({msg:"Account created succesfully"})
              

            }catch(err){

                console.log(err)
                return response.status(500).json({msg:"Failed to create account"})
                
            }
        })

    }


    Signin(request,response){

        const form = new IncomingForm.IncomingForm()


        form.parse(request, async(error,fields,files)=>{


            if(error){

                return response.status(500).json({msg:"Network Error : failed to login "})
                
            }
    
    
            const  {account,password} = fields
            const isAccountemail = account.includes('@')

            console.log(`password ${password} email ${account}`)
    
            if(isAccountemail){
    
                const user = await usermodel.findOne({email:account})
                
                if(!user){
    
                    return response.status(404).json({msg:"Account with this email does not exist"})
                }
    

                // bycrypt.hash(password, 15, async function(err, hash) {
                //     if (err) { throw (err); }
                
                //      bycrypt.compare(password, hash, function(err, result) {
                //         if (result == false) {    return response.status(400).json({msg:"invalid credentials"}) }
                //         else{
                //             console.log(result);
                //             console.log(`verified`)
                //         }
                       
                //     });
                // });

              
                let passwordHash = await bycrypt.hash(password, 15);
                const isPasswordvalid =  await bycrypt.compare(JSON.stringify(password),user.password)
                console.log(isPasswordvalid)
               
    
                if(!isPasswordvalid){


                    console.log("invalid password")
                    return response.status(400).json({msg:"invalid credentials"})
    
                }

            

                const token_payload = {
    
                    _id:user._id,
                    email:user.email,
                    username : user.username
                }
    
                const token = jwt.sign(token_payload,process.env.cookie_secret,{ expiresIn : "365d"})
                console.log(`Sigin success`)
                return response.status(200).json({token,msg:"Sign in success",id:user._id,username:user.username})
            
            }


               
          
        })

     

    }


    uploadpicture(request,response){

        const profilephotopath = request.filename
        const token = request.headers.authorization
        
            const TokenArray = token.split(" ");
            const _token = jwt.decode(TokenArray[1])
            const decoded = jwt.verify(TokenArray[1],process.env.cookie_secret);
            console.log(TokenArray[1])

        usermodel.findOneAndUpdate({_id:decoded._id},{$set:{profilephoto:profilephotopath}},({new:true}),(err,doc)=>{

            if(err){

                response.status(500).send({
                    msg:"Something went wrong failed to upload profile"
                })

            }
            else{


                response.status(201).send({
                    msg:"Profile photo upload success",
              
                })

            }

        })



    }


    async getprofile(request,response){

        const ID = request.params.id

        console.log(ID)
    
        var prevFolder= path.basename(path.dirname("src"))
        const profilepath = path.join(__dirname.replace("\\Controller",""),"Profiles",ID+".jpeg")
        console.log(profilepath+prevFolder)
        fs.exists(profilepath, function (exists) {
 
            // if (!exists) {

            //     response.writeHead(404, {
            //         "Content-Type": "text/plain" });
            //     response.end({msg:"404 Not Found"});
            //     return;
            // }

            var action = profilepath;
     
            // Extracting file extension
            var ext = path.extname(action);
     
            // Setting default Content-Type
            var contentType = "text/plain";
     
            // Checking if the extension of
            // image is '.png'
            if (ext === ".png") {
                contentType = "image/png";
            }

            if (ext === ".jpeg") {
                contentType = "image/jpeg";
            }


            console.log(ext)
     
            // Setting the headers
            response.writeHead(200, {
                "Content-Type": contentType });
     
            // Reading the file
            fs.readFile(profilepath,
                function (err, content) {
                    // Serving the image
                    response.end(content,'base64');
                   
                });
        });


    }



   async profiledata(request,response){


        const token = request.headers.authorization
        const TokenArray = token.split(" ");
        const decoded = jwt.verify(TokenArray[1],process.env.cookie_secret);
        console.log(decoded)

        const data =  await usermodel.findOne({_id:decoded._id})
        console.log(data)

        

        return response.status(200).end(JSON.stringify(data))

    }



    forgotPassword(request,response){

        const form =  new IncomingForm.IncomingForm()

        form.parse(request, async (error,fields,files) => {

            if(error){

                return response.status(500).json({msg:""})
            }

            const {email,password} = fields

            if(!email || !password ){

                return response.status(400).json({msg:"All fields are required to reset the password"})
            }

            const salt = bycrypt.genSalt(15)
            const hashepassword = bycrypt.hash(password,salt)

            try{


                const updateAccount = await usermodel.findOneAndUpdate({email:email},{$set:{password:hashepassword}})
                return response.status(200).json({msg:"Account password reseted successfully"})
            }
            catch(err){

                return response.status(400).json({msg:"failed to reset the password"})

            }

        })


    }

    
}

module.exports = AuthController
