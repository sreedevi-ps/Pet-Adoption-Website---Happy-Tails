const mongoose=require("mongoose");
var adminSchema=mongoose.Schema({
                            // we can never add these as primary key...mongodb self generates an underscore id
    name:{type:String },
    emailId:{type:String,required:true},
    password:{type:String,required:true},
    orgName: { type : String , required : true},
    role:{type:String,required:true},
    passwordResetOTP: {
        type: String // Assuming OTP will be stored as a string
    },
    status:{type:String,default:"Active"}
})


module.exports=mongoose.model("AdminModel",adminSchema);// this for cloud to understand and the Adminmodel is the name to recognise there