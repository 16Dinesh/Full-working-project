const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require('multer');
const { isLoggedIn, isOwnerOrAdmin, validateListing } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const { storage } = require("../cloudConfig.js");

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5 MB size limit
});

// Routes

// Create and Index
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));

// New
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Search
router.get('/search', wrapAsync(listingController.searchBar));

// Show, Update, Delete
router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwnerOrAdmin, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwnerOrAdmin, wrapAsync(listingController.destroyListing));

// Edit
router.get("/:id/edit", isLoggedIn, isOwnerOrAdmin, wrapAsync(listingController.renderEditForm));

module.exports = router;
