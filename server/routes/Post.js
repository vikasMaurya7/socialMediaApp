const express = require("express");
const { createPost, likeUnlikePost,deletePost, getPOstOfFollowing } = require("../controllers/Post");
const { isAuthenticate } = require("../middlewares/Auth");

const router = express.Router();

router.route("/post/upload").post(isAuthenticate,createPost);

router
    .route("/post/:id")
    .get(isAuthenticate,likeUnlikePost)
    .delete(isAuthenticate,deletePost);

router.route("/posts").get(isAuthenticate,getPOstOfFollowing);

module.exports = router;