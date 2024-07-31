const express = require('express');
const router = express.Router();
const passport = require('passport');
const adminController = require('../controller/admin.js');

// Admin login
router.route("/admin/login")
    .get(adminController.renderAdminLoginForm)
    .post(passport.authenticate("local", {
        failureRedirect: "/admin/login",
        failureFlash: true,
        successFlash: 'Welcome back, Admin!'
    }), adminController.adminLogin);

// Admin signup
router.route("/admin/signup")
    .get(adminController.renderAdminSignupForm)
    .post(adminController.adminSignup);

// Admin logout
router.get("/admin/logout", adminController.adminLogout);

module.exports = router;
