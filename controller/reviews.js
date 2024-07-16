const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res) => {
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
};

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await  Review.findByIdAndDelete(reviewId);
    req.flash("done", "Review Deleted")
    res.redirect(`/listings/${id}`);
}