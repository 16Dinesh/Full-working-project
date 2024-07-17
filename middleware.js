const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");

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
};

// Validate Owner
module.exports.isOwnerOrAdmin = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    // Check if the listing exists
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect('/listings');
    }
    
    // Check if the user is the owner or an admin
    if (!listing.owner._id.equals(res.locals.localuser._id) && !res.locals.localuser.isAdmin) {
        req.flash("error", "You Are Not The Owner");
        return res.redirect(`/listings/${id}`);
    }
    
    next();
};


// validation Error Listing 
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthorOrAdmin = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    // Check if the review exists
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    
    // Check if the user is the author or an admin
    if (!review.author.equals(res.locals.localuser._id) && !res.locals.localuser.isAdmin) {
        req.flash("error", "You Can't Delete This Review");
        return res.redirect(`/listings/${id}`);
    }
    
    next();
};


module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    req.flash("error", "You do not have permission to access this page.");
    res.redirect("/");
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



