const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

// signup
router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.userPost));

// login
router.get("/login", userController.renderLoginForm);

router.post("/login",saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true 
}), userController.signupPost);

// logout
router.get("/logout", userController.userLogout);


module.exports = router;
