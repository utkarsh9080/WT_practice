const Student = require("../models/Student");

const createStudent = async (req,res)=>{
    try{
        const student = await Student.create(req.body);
        return res.status(201).json({success:true,data:student});
    }catch(error){
        if(error.code===11000&&error.keyPattern?.rollNo){
            return res.status(409).json({message:"roll number already exists"});
        }
        return res.status(408).json({message:error.message});
    }
};

const readStudent = async (req,res)=>{
        const student = await Student.find();
        res.status(201).json({
        data:student
    })
}

const getStudentById = async (req, res) => {
    const student =
      await Student.findById(
        req.params.id
      );
      res.status(200).json({
        data:student
      })
    }

const updateStudent = async(req,res)=>{
    try{
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if(!student){
            return res.status(404).json({message:"student not found"});
        }
        res.status(200).json({
            message:"Student updated successfully",
            data:student
        });
    }catch(error){
        if(error.code===11000&&error.keyPattern?.rollNo){
            return res.status(409).json({message:"roll number already exists"});
        }
        return res.status(408).json({message:error.message});
    }
}

const deleteStudent = async (req,res)=>{
    const student = await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({
        message:"student deleted successfully"
    })
}


module.exports = {
    createStudent,
    readStudent,
    getStudentById,
    updateStudent,
    deleteStudent
}