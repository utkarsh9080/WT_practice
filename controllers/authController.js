const bcrypt = require("bcrypt");
const User = require("../models/User");
const {  generateToken} =require("../services/tokenServices");

const register = async (req,res)=>{
    const {
        name,
        email,
        password,
        role
    } = req.body;

    //check whether user already exists
    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(409).json({
            message:"Email already registered"
        });
    }

    //Hash Password

    const hashedPassword = await bcrypt.hash(password,12);

    //Store user in MongoDB

    const user = await User.create({
        name,
        email,
        password:hashedPassword,
        role
    });

    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        }
    });
};

const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({ email });
        if(!user){
          return res.status(401).json({message:"invalid email or password"})
        }
        const now = new Date();
        if(user.lockUntil && user.lockUntil>now){
          return res.status(423).json({message:"Account temporarily locked "});
        }

        if(user.lockedUntil && user.lockUntil<=now){
          user.failedLoginAttempts =0;
          user.lockUntil=null;
        }
        const passwordMatched = await bcrypt.compare(password, user.password);

        // req.session.user = {
        // id: user._id,
        // email: user.email,    
        // role: user.role
        // };
        if(!passwordMatched){
          user.failedLoginAttempts +=1;
          if(user.failedLoginAttempts>=3){
            user.lockUntil = new Date(Date.now() + 10*60*1000);
          }
          await user.save();
          if(user.lockUntil){
            return res.status(423).json({message:"Account temporarily blocked"});
          }
          return res.status(401).json({message:"invalid email or password"});
        }
        user.failedLoginAttempts =0;
        user.lockUntil = null;
        await user.save();
        const token = generateToken(user);
        res.cookie("accessToken",token,{httpOnly: true});

        res.status(200).json({
            message:"Login Successful",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });
    }catch(error){
      return res.status(500).json({message:"Login failed"});
    }
    }

    const getCurrentUser =
  async (req, res) => {

    res.status(200).json({

      user: {

        id:
          req.user._id,

        name:
          req.user.name,

        email:
          req.user.email,

        role:
          req.user.role

      }

    });

  };

    const logout = async (req,res) => {
    req.session.destroy(
    error => {
      if (error) {
        return res.status(500).json({message:"Logout failed"});
      }
    //   res.clearCookie("connect.sid");
     res.clearCookie("accessToken",{httpOnly: true} );

      res.status(200).json({message:"Logout successful"});

    }
  );

};

module.exports = {register,login,logout,getCurrentUser};