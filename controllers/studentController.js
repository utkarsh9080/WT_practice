const Student = require("../models/Student");

const createStudent = async (req,res)=>{
//         const student = await Student.create(req.body);
//         res.status(201).json({
//         success:true,
//         data:student
// });
        try{
            const student = await Student.create(req.body);
            return res.status(201).json({success:true,data:student});
        }catch(error){
            if(error.name==="ValidationError"){
                return res.status(400).json({message: error.message});
            }
            return res.status(500).json({message:"unable to create student"});
        }
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
    // const student = await Student.findByIdAndUpdate(req.params.id, req.body, {new:true});
    // res.status(200).json({message:"Student updated successfully",data:student});
    try{
        const student = await student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true,runValidators:true}
        );
        if(!student){
            return res.status(400).json({message:"student not found"});
        }
        return res.status(200).json({
            message:"student updated successfully",
            data:student
        })
    }catch(error){
        if(error.name==="ValidationError"){
            return res.status(400).json({message:error.message});
        }else{
            return res.statuc(500),json({message:"unable to update student"})
        }
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