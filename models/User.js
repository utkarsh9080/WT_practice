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
    refreshToken:{
        type:String,
        default:null
    },
    refreshTokenIp:{
        type:String,
        default:null
    }
})

module.exports = mongoose.model("User",userSchema);