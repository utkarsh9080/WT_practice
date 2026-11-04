const Student = require("../models/Student");

const createStudent = async (req,res)=>{
        const student = await Student.create({
            name:req.body.name,
            age:req.body.age,
            dept:req.body.dept,
            createdBy:req.user._id
        });
        res.status(201).json({success:true,data:student});
}

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
    const student = await Student.findById(req.params.id);
    if(!student){
        return res.status(404).json({messsage:"student not found"});
    }
    const isOwner = student.createdBy.toString()=== req.user._id.toString();
    const isAdmin = req.user.role ==="admin";
    if(!isAdmin&&!isOwner){
        return res.status(403).json({message:"access denied"})
    }
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
    res.status(200).json({
        message:"Student updated successfully",
        data:updated
    });
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