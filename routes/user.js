const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

// signup
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.userPost));

// login
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true 
}), userController.signupPost);

// logout
router.get("/logout", userController.userLogout);

module.exports = router;
