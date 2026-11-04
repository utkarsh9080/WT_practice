const express = require("express");

const {register,login,logout,refreshAccessToken} = require("../controllers/authController");
// const requireSessionAuth=require("../middleware/sessionAuth");
const requireJwtAuth=require("../middleware/jwtAuth");

const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/refresh ",refreshAccessToken);
router.post("/logout",logout);

module.exports = router;