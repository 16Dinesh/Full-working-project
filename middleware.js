module.exports.isLoggedIn = (req, res, next) => {
    //console.log(req.path, "..", req.originalUrl)  --> path
    //console.log(req)
    //console.log(req.body)
    if (!req.isAuthenticated()) {
        //redirectUrl 
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You Must Be Logged In To Do Any Thing! ");
        return res.redirect("/login")
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}