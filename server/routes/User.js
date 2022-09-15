const express = require("express");
const { register, login, followUnfollwUser, logout } = require("../controllers/User");
const { isAuthenticate } = require("../middlewares/Auth");


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);



router
    .route("/follow/:id")
    .get(isAuthenticate, followUnfollwUser)

router.route("/logout").get(logout);

module.exports = router;