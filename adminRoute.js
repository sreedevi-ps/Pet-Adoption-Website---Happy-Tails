const express = require("express");
var router = express.Router();
var bcryptjs = require("bcryptjs");
var adminModel = require("../Models/adminModel");


var jsonwebtoken=require("jsonwebtoken");
var TokenModel=require("../Models/tokenModel");
const adminAuth=require('../Middleware/adminAuth');

router.post("/admin/register", async (req, res) => {
  var { name, emailId, password, orgName,  contactNo } = req.body;

  if (name == null || name == undefined) {
    res.status(200).json({
      status: false,
      msg: "invalid name",
    });
    return;
  }
  if (emailId == null || emailId == undefined) {
    res.status(200).json({
      status: false,
      msg: "invalid emailId",
    });
    return;
  }
  var alreadyexists = await adminModel.findOne({
    status: "Active",
    emailId: emailId,
  });
  if (alreadyexists != null) {
    res.status(200).json({
      status: false,
      msg: "this email alreadyexists",
    });
    return;
  }

  if (password == null || password == undefined || password.length < 8) {
    res.status(200).json({
      status: false,
      msg: "Password should be at least 8 characters long",
    });
    return;
  }
  if (orgName == null || orgName == undefined) {
    res.status(200).json({
      status: false,
      msg: "invalid orgName",
    });
    return;
  }
  if (contactNo == null || contactNo == undefined || contactNo.length !== 10) {
    res.status(200).json({
      status: false,
      msg: "Contact number should be 10 digits long",
    });
    return;
  }

  var encryptedpassword = await bcryptjs.hash(password, 10);
  var data = new adminModel();
  data.name = name;
  data.emailId = emailId;
  data.password = encryptedpassword;
  data.orgName = orgName;
  data.role = "admin";
  data.contactNo = contactNo;

  await data.save();
  console.log(data._id);

  res.status(200).json({
    status: true,
    msg: "registration success",
    user: data,
  });
  return;
});

router.post("/admin/login", async (req, res) => {
  try {
    var { emailId, password } = req.body;
    if (emailId == null || emailId == undefined) {
      res.status(200).json({
        status: false,
        msg: "invalid emailid",
      });
      return;
    }

    var alreadyexists = await adminModel.findOne({
      status: "Active",
      emailId: emailId,
    });
    if (alreadyexists == null) {
      res.status(200).json({
        status: false,
        msg: "please register this email id",
      });
      return;
    }
    if (password == null || password == undefined) {
      res.status(200).json({
        status: false,
        msg: "invalid password",
      });
      return;
    }
    var isok = await bcryptjs.compare(password, alreadyexists.password);
    if (isok == true) {
      console.log("success")
      res.status(200).json({
        status: true,
        msg: "login success",
      });
      return;
    } else {
      res.status(200).json({
        status: false,
        msg: "invalid credentials",
      });
      return;
    }
  } catch (e) {
    console.log(e);
  }
});



router.post("/admin/login/token", async(req,res)=> {
    
  try{
      var { emailId,password} = req.body
      if (emailId == null || emailId == undefined ) {
          res.status(200).json({
              status: false,
              msg: "invalid emailId",
      
      
          })
          return;
      }

       
      
      var alreadyexists=await adminModel.findOne({ status:"Active",emailId:emailId})
      if(alreadyexists == null){
       res.status(200).json({
      status: false,
      msg: "please register this emailId",


  })
  return;

 }
 if (password == null || password == undefined) {
  res.status(200).json({
      status: false,
      msg: "invalid password",


  })
  return;
}
var isok= await bcryptjs.compare(password,alreadyexists.password)
  if(isok==true){
      var token= await jsonwebtoken.sign({
          
          user:alreadyexists,
          id: alreadyexists._id,
          role:alreadyexists.role
      },"sreedevi",{expiresIn:120000000000})
      var tok=new TokenModel()
      tok.token=token;
      tok.userid=alreadyexists._id;
      await tok.save();
      res.status(200).json({
          status: true,
          msg: "login success",
          token:token
  
  
      })
      return;

  }
  else{
      res.status(200).json({
          status: false,
          msg: "invalid credentials",
  
  
      })
      return;
  }
  


  }
  catch(e){
      console.log(e)
  }


})

router.post("/admin/forgot", async (req, res) => {
  var { emailId, new_pwd, confirm_pwd } = req.body;

  if (emailId == null || emailId == undefined) {
    res.status(200).json({
      status: false,
      msg: "invalid emailId",
    });
    return;
  }

  if (new_pwd == null || new_pwd == undefined || new_pwd.length < 8) {
    res.status(200).json({
      status: false,
      msg: "invalid new password",
    });
    return;
  }

  if (confirm_pwd == null || confirm_pwd == undefined) {
    res.status(200).json({
      status: false,
      msg: "invalid confirm password",
    });
    return;
  }
  if (new_pwd != confirm_pwd) {
    res.status(200).json({
      status: false,
      msg: "new pwd and confirm pwd are not same",
    });
    return;
  }

  var alreadyexists = await adminModel.findOne({
    status: "Active",
    emailId: emailId,
});
  if (alreadyexists != null) {
    var encryptedpassword = await bcryptjs.hash(confirm_pwd, 10);
    alreadyexists.password = encryptedpassword;

    await alreadyexists.save();
    console.log(alreadyexists._id);
    res.status(200).json({
      status: true,
      msg: "password changed successfully",
    });
    return;
  }
});

router.post("/reviewer/register", async (req, res) => {
  var { name, emailId, password, orgName, role } = req.body;

  if (name == null || name == undefined) {
    res.status(200).json({
      status: false,
      msg: "invalid name",
    });
    return;
  }
  if (emailId == null || emailId == undefined) {
    res.status(200).json({
      status: false,
      msg: "invalid emailId",
    });
    return;
  }
  var alreadyexists = await adminModel.findOne({
    status: "Active",
    emailId: emailId,
  });
  if (alreadyexists != null) {
    res.status(200).json({
      status: false,
      msg: "this email alreadyexists",
    });
    return;
  }

  if (password == null || password == undefined || password.length < 8) {
    res.status(200).json({
      status: false,
      msg: "Password should be at least 8 characters long",
    });
    return;
  }
  if (orgName == null || orgName == undefined) {
    res.status(200).json({
      status: false,
      msg: "invalid orgName",
    });
    return;
  }

  var encryptedpassword = await bcryptjs.hash(password, 10);
  var data = new adminModel();
  data.name = name;
  data.emailId = emailId;
  data.password = encryptedpassword;
  data.orgName = orgName;
  data.role = "reviewer";

  await data.save();
  console.log(data._id);

  res.status(200).json({
    status: true,
    msg: "registration success",
    user: data,
  });
  return;
});


router.post("/reviewer/login", async (req, res) => {
  try {
    var { emailId, password } = req.body;
    if (emailId == null || emailId == undefined) {
      res.status(200).json({
        status: false,
        msg: "invalid emailid",
      });
      return;
    }

    var alreadyexists = await adminModel.findOne({
      status: "Active",
      emailId: emailId,
    });
    if (alreadyexists == null) {
      res.status(200).json({
        status: false,
        msg: "please register this email id",
      });
      return;
    }
    if (password == null || password == undefined ) {
      res.status(200).json({
        status: false,
        msg: "invalid password",
      });
      return;
    }
    var isok = await bcryptjs.compare(password, alreadyexists.password);
    if (isok == true) {
      res.status(200).json({
        status: true,
        msg: "login success",
      });
      return;
    } else {
      res.status(200).json({
        status: false,
        msg: "invalid credentials",
      });
      return;
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/reviewer/forgot", async (req, res) => {
  var { emailId, new_pwd, confirm_pwd } = req.body;

  if (emailId == null || emailId == undefined) {
    res.status(200).json({
      status: false,
      msg: "invalid emailId",
    });
    return;
  }

  if (new_pwd == null || new_pwd == undefined || new_pwd.length < 8) {
    res.status(200).json({
      status: false,
      msg: "invalid new password",
    });
    return;
  }

  if (confirm_pwd == null || confirm_pwd == undefined) {
    res.status(200).json({
      status: false,
      msg: "invalid confirm password",
    });
    return;
  }
  if (new_pwd != confirm_pwd) {
    res.status(200).json({
      status: false,
      msg: "new pwd and confirm pwd are not same",
    });
    return;
  }

  var alreadyexists = await adminModel.findOne({
    status: "Active",
    emailId: emailId,
});
  if (alreadyexists != null) {
    var encryptedpassword = await bcryptjs.hash(confirm_pwd, 10);
    alreadyexists.password = encryptedpassword;

    await alreadyexists.save();
    console.log(alreadyexists._id);
    res.status(200).json({
      status: true,
      msg: "password changed successfully",
    });
    return;
  }
});



router.get("/logout/admin",adminAuth,async(req,res)=> {
    
  try{
     
    var {token}=req.headers
     
 if (token== null || token== undefined) {
  res.status(200).json({
      status: false,
      msg: "invalid token",


  })
  return;
}
var tokenexists=await TokenModel.findOne({token:token })
if(tokenexists !=null){
   tokenexists.status="Deleted"
   res.status(200).json({
      status: true,
      msg: "token cleared",
      token:token


  })
  return;
}
else{
  res.status(200).json({
      status: true,
      msg: "invalid token",
      


  })
  return;

}

         
  


  }
  catch(e){
      console.log(e)
  }


})


module.exports = router;
