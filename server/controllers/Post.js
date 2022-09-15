const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async(req,res)=>{
    try {
        const post = {
            caption:req.body.caption,
            image:{
                public_id:"temp public id",
                url:"temp url",
            },
            owner:req.user
        }
        const newPost = await Post.create(post);
        // console.log(req.user._id);
        const user = await User.findById(req.user._id);
        // console.log(user);
        console.log(user.posts);
        user.posts.push(newPost._id);

        await user.save();

        res.json({newPost});
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.likeUnlikePost = async(req,res)=>{
    try {

        const post = await Post.findById(req.params.id);
        console.log(post)

        if(!post) return res.status(404).json({success:false,message:"invalid id!.."})

        if(post.likes.includes(req.user._id)){
            const index = post.likes.indexOf(req.user._id);

            post.likes.splice(index,1);

            await post.save();
            
            return res.status(201).json({success:true,message:"post unliked"});
        }
        post.likes.push(req.user._id);

        await post.save();

        return res.status(201).json({success:true,message:"post liked"});

    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }

}

// delete post

exports.deletePost = async(req,res)=>{
    try {
        
        const post = await Post.findById(req.params.id);

        if(!post) return res.status(404).json({success:false,message:"post not found!.."});

        if(post.owner.toString() != req.user._id.toString()) return res.status(404).json({success:false,message:"unauthorized access"});

        await post.remove();

        const user = await User.findById(req.user._id);

        const index = user.posts.indexOf(req.params.id);

        user.posts.splice(index,1);

        await user.save();

        return res.status(201).json({success:true,message:"post deleted successfully!..."});

    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
    
}


// foloowing post

exports.getPOstOfFollowing = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id);

        const posts = await Post.find({
            owner:{
                $in:user.following
            }
        })
        return res.status(200).json({success:true,posts});
        
    } catch (error) {
        return res.status(400).json({success:false,message:error.message});
    }
}








