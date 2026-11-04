const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name:String,
    age:Number,
    dept:String,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        immutable:true
    }
});

const Student = mongoose.model("Student",studentSchema);

module.exports = Student