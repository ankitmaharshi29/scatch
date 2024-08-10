const generateToken = require("../utils/generateToken");
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken")

module.exports.registerUser =  async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    let user=  await userModel.findOne({email:email});
    if(user){return res.status(401).send("already have a account")

    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {

        let user = await userModel.create({
          email,
          password: hash,
          fullname,
        });
    
        

        let token = generateToken(user);
        res.cookie("token", token);
         console.log(user);
         

        res.send(user);
      });
    });
  } catch {
    res.status(500).send("error");
  }
};

module.exports.loginuser =  async (req, res) => {
  
    const {  email, password } = req.body;
    let user=  await userModel.findOne({email:email});
    if(!user) return res.status(401).send("incorrect email or password");

    bcrypt.compare(password,user.password,(err,result)=>{
      if(result){
        let token = generateToken(user);
        res.cookie("token",token);
        res.redirect("/shop")
      }
      else{
      
        return res.status(401).send("incorrect email or password");
        
      }
    })
      
    } 
   

  module.exports.logoutuser =   async(req,res)=>{
    res.clearCookie("token","");
    res.redirect("/")
  }
