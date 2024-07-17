const User = require("../models/user.js");

module.exports.renderAdminLoginForm = (req, res) => {
    res.render("admin/login.ejs"); 
};

module.exports.adminLogin = (req, res) => {
    req.flash("done", "Welcome back, Admin!");
    res.redirect("/listings");
};

module.exports.renderAdminSignupForm = (req, res) => {
    res.render("admin/signup.ejs"); // Ensure this file exists
};

module.exports.adminSignup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newAdmin = new User({ username, email, isAdmin: true }); // Set isAdmin to true
        const registeredAdmin = await User.register(newAdmin, password);
        
        req.login(registeredAdmin, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("done", "Admin account created and logged in!");
            res.redirect("/"); // Redirect to admin dashboard or another page
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/admin/signup");
    }
};

module.exports.adminLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("done", "You have logged out successfully.");
        res.redirect("/");
    });
};
