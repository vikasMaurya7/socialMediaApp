const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.isAuthenticate = async(req,res,next)=>{
    const {token} = req.cookies;

    if(!token) return res.status(401).json({success:false,message:"please login first!.."});
    
    try {
       
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decode._id);
        next();
    } 
    catch (error) {

        if(!decode) return res.status(401).json({success:false,message:"can not be login please try again!.."});
    }

}