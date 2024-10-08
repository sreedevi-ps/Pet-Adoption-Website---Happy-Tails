var jsonwebtoken=require('jsonwebtoken');
var TokenModel=require("../Models/tokenModel");
const adminModel=require("../Models/adminModel");

module.exports=async function(req,res,next){
    try{
        var { token}=req.headers
        if(token==null || token==undefined){
            res.status(200).json({
                status: false,
                msg: "unauthorised access",
        
        
            })
            return;
        }
        var userdetails= await jsonwebtoken.verify(token,'sreedevi')
        if(userdetails !=null || userdetails!=undefined){

            if(userdetails.role !="admin"){
                res.status(200).json({
                    status: false,
                    msg: "invalid token",
            
            
                })
                return;
            }
            req.user=userdetails.user
            req.user.id=userdetails.id
            next();
        }
        else{
            res.status(200).json({
                status: false,
                msg: "invalid admin",
        
        
            })
            return;

        }

    }
    catch(e){
        console.log(e);

    }
}