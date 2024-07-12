const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

//Reviews - POST Route
router.post("/",isLoggedIn, validateReview, wrapAsync(async(req,res) => {
    // console.log(req.params.id)
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id
    //console.log(newReview)
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("done", "New Review Created")
    res.redirect(`/listings/${listing._id}`)

}));

// Reviews - Delete Route 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await  Review.findByIdAndDelete(reviewId);
    req.flash("done", "Review Deleted")
    res.redirect(`/listings/${id}`);
}))

module.exports = router;