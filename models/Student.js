const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    rollNo:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        uppercase:true
    },
    name:String,
    age:Number,
    dept:String
})

const Student = mongoose.model("Student",studentSchema);

module.exports = Student