const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let schema = mongoose.Schema;

const userSchema = new schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
    },
    email:{
        type:String,
        required:[true,"please enter your name"],
        unique:[true,"email already exists!.."]
    },
    password:{
        type:String,
        required:[true,"enter your password"],
        minlength:[6,"password must be atleast 6 characte!.."],
        select:false,    // access document from database pasword will not return
    },
    avtar:{
        public_id:String,
        url:String
    },

    posts:[
        {
            type:schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    followers:[
        {
            type:schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:schema.Types.ObjectId,
            ref:"User"
        }
    ]
})

// middleware run everytime before save document

userSchema.pre("save", async function (next) {                            
    this.isModified("password") && (this.password = await bcrypt.hash(this.password,10));
    next();
})

// compare password it return true if password match otherwise false

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password);
}
// json web token
userSchema.methods.generateToken = function(){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET);
}
module.exports =  mongoose.model("User",userSchema);