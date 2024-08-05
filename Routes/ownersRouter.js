const express = require("express");
const router= express.Router();
const ownerModel= require("../models/owner-model");

router.get("/",(req,res)=>{
    res.send("seyy hi")
});


if(process.env.NODE_ENV === "development"){

    router.post("/create",async (req,res)=>{
       let owners = await ownerModel.find();
       if(owners.length>0){
        return res.status(503).send("you don't have permission");}


        let{fullname,email,password}= req.body
      let createdOwner=  await ownerModel.create({
            fullname:String,
            email:String,
            password:String,
          
        });
       
res.status(201).send(createdOwner)

    });
}
module.exports=router