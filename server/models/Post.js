const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    caption:String,
    image:{
        public_id:String,
        url:String,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    createAt:{
        type:Date,
        default:Date.now(),
    },
    likes:[
        {
            type:Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    comments:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:"User",
            },
            comment:{
                type:String,
                required:true
            }
        }
    ]
})

module.exports = mongoose.model("Post",postSchema);