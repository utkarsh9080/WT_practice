const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    failedLoginAttempts:{
        type:Number,
        default:0
    },
    lockUntil:{
        type:Date,
        default:null
    }

})

module.exports = mongoose.model("User",userSchema);