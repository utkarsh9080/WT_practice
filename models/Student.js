const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        age:{
            type:Number,
            required:true,
            min:16,
            max:120
        },
        dept:{
            type:String,
            required:true,
            enum:["CSE","ECE","EEE","MECH","CIVIL"]
        }
    },
    {
        timestamp:true
    }
)

const Student = mongoose.model("Student",studentSchema);

module.exports = Student