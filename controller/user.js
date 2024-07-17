const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.userPost = async (req, res) => {
    try {
        const { username, email, password, adminCode } = req.body;
        const newUser = new User({ username, email });
        if (adminCode === 'Admin@123') { 
            newUser.isAdmin = true;
        }
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("done", "User Registered");
            res.redirect("/");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.signupPost = async (req, res) => {
    req.flash("done", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/"
    res.redirect(redirectUrl);
}

module.exports.userLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("done", "You are logged out!");
        res.redirect("/");
    });
}
