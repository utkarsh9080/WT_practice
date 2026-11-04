const bcrypt = require("bcrypt");
const User = require("../models/User");
const {  generateToken} =require("../services/tokenServices");
const jwt = require("jsonwebtoken");

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
        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({
            email
        });

        const passwordMatched = await bcrypt.compare(password, user.password);
        const clientIp = req.ip || req.socket.remoteAddress;
        const refreshToken = jwt.sign(
            { id:user._id },
            process.env.REFRESH_TOKEN_SECRET || "refreshsecret",
            {expiresIn:"7d"}
          )
          user.refreshToken = refreshToken;
          user.refreshTokenIp = clientIp;
          await user.save();
            const token = generateToken(user);
            res.cookie("accessToken",token,{httpOnly: true});
            res.cookie("refreshToken",refreshToken,{httpOnly:true});

        res.status(200).json({
            message:"Login Successful",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });
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

const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const clientIp = req.ip || req.socket.remoteAddress;
    const user = await User.findOne({ refreshToken: token });

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // IP Check
    if (user.refreshTokenIp !== clientIp) {
      user.refreshToken = null;
      user.refreshTokenIp = null;
      await user.save();
      res.clearCookie("refreshToken");

      return res.status(401).json({ message: "Refresh token IP mismatch" });
    }

    // Matching IP: issue new accessToken
    const accessToken = generateToken(user);
    res.cookie("accessToken", accessToken, { httpOnly: true });

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to refresh token" });
  }
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    refreshAccessToken
};