require("dotenv").config({path:"./config/config.env"});
const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDatabase } = require("./config/database");
const user = require("./routes/User");
const post = require("./routes/Post");

const app = express();


connectDatabase();



// using middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

// database connection function


// router middlewre
app.use("/api/v1",post);
app.use("/api/v1",user);




app.listen(process.env.PORT,()=>{
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})