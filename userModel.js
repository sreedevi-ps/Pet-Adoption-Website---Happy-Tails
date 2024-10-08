const mongoose=require("mongoose");
var userSchema=mongoose.Schema({
                           
    name:{type:String },
    emailId:{type:String,required:true},
    password:{type:String,required:true},
    address:{type:String,required:true},
    contactNo:{type:Number},
    pincode: { type : Number , required: true} , 
    city :{type: String},
    role:{type:String,required:true},
    passwordResetOTP: {
        type: String // Assuming OTP will be stored as a string
    },
    status:{type:String,default:"Active"}
})


module.exports=mongoose.model("UserModel",userSchema);// this for cloud to understand and the Usermodel is the name to recognise there