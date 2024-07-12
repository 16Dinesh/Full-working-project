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
module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listings = await Listing.findById(id);
    if (!listings.owner._id.equals(res.locals.localuser._id)) {
        req.flash("error", "You Are Not The Owner")
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

// validation Error Review 
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Validation Review Author 
module.exports.isReviewAuthor = async(req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.localuser._id)) {
        req.flash("error", "You Can't Delete This Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
