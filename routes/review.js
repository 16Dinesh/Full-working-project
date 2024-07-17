const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isReviewAuthorOrAdmin } = require("../middleware.js");
const reviewController = require("../controller/reviews.js");

// Reviews - POST Route (for creating a new review)
router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));

// Reviews - DELETE Route (for deleting an existing review)
router.delete("/:reviewId", isLoggedIn, isReviewAuthorOrAdmin, wrapAsync(reviewController.destroyReview));

module.exports = router;
