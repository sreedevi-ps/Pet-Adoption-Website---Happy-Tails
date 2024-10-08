var jsonwebtoken=require('jsonwebtoken');
var TokenModel=require("../Models/tokenModel");
const userModel=require("../Models/userModel");

//userAuth will work only for data with role="user"
//initially there was no role in model
//I added it later so old data's token may not get access.

module.exports=async function(req,res,next){
    try{
        var { token}=req.headers
        if(token==null || token==undefined){
            res.status(200).json({
                status: false,
                msg: "unauthorised access no token",
        
        
            })
            return;
        }
        var userdetails= await jsonwebtoken.verify(token,'sreedevi')
        if(userdetails !=null || userdetails!=undefined){

            if(userdetails.role !="user"){
                res.status(200).json({
                    status: false,
                    msg: "unauthorised access",
            
            
                })
                return;
            }
            req.user=userdetails.user
            req.user.id=userdetails.id
            console.log("rzxhdtjcfyvghbjnkml")
            next();
        }
        else{
            res.status(200).json({
                status: false,
                msg: "invalid user",
        
        
            })
            return;

        }

    }
    catch(e){
console.log(e)
    }
}