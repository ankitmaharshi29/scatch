const mongoose = require("mongoose");
const { type } = require("os");
const { boolean } = require("webidl-conversions");



const userSchema = mongoose.Schema({
    fullname:String,
    email:String,
    password:String,
    cart:{
        type:Array,
        default:[]
    },

    orders:{
        type:Array,
        default:[],
    },
    contact:Number,
    picture:String,
});

 module.exports=mongoose.model("user",userSchema);
