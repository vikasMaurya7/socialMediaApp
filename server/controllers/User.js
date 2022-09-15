const User = require("../models/User");

const options = {
    expires: new Date(Date.now()+90*24*60*60*1000),
    httpOnly: true,
}

exports.register = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        
        let user = await User.findOne({email});

        if(user) return res.status(400).json({success:false,message:"user already exist"});

        user = await User.create({name,email,password,avtar:{public_id:"temp id",url:"temp rrl"}});

        const token = await user.generateToken();

        res.status(200).cookie("token",token,options).json({success:false,user,"message":"registration succefully"});

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.login = async(req,res)=>{
    try {
        
        
        const {email,password} = req.body;

        const user = await User.findOne({email}).select("+password");

        if(!user) return res.status(400).json({success:false,message:"user does not exists"});

        const isMatch = await user.matchPassword(password);

        if(!isMatch) return res.status(400).json({success:false,message:"password does not match!.."});

        const token = await user.generateToken();

        res.status(200).cookie("token",token,options).json({success:false,user,message:"login successfully"});


    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// follow user
exports.followUnfollwUser = async(req,res)=>{
    try {

        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);

        if(!userToFollow) return res.status(404).json({success:false,message:"user not found"});

        if(userToFollow.followers.includes(loggedInUser._id)){
            const indexFollow = userToFollow.followers.indexOf(loggedInUser._id);
            const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);

            userToFollow.followers.splice(indexFollow,1);
            loggedInUser.following.splice(indexFollowing,1);

            await userToFollow.save();
            await loggedInUser.save();
        
            return res.status(201).json({success:true,message:"user unfollow sucessfully!.."});
        }

        else{
            userToFollow.followers.push(loggedInUser._id);
            loggedInUser.following.push(userToFollow._id);

            await userToFollow.save();
            await loggedInUser.save();
        
            return res.status(201).json({success:true,message:"follow succesfully"});
        }

    } catch (error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

// logout

exports.logout = async(req,res)=>{
    try {
        return res.status(400)
                            .cookie("token",null,{expires:new Date(Date.now()),httpOnly:true})
                            .json({success:true,message:"logout succes!..."});
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}