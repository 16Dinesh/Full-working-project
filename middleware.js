module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user)
    if (!req.isAuthenticated()) {
        req.flash("error", "You Must Be Logged In To Do Any Thing! ");
        return res.redirect("/login")
    }
    next();
}