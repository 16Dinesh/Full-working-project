const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require('multer');
const {isLoggedIn , isOwnerOrAdmin, validateListing} = require("../middleware.js");
const path = require("path");
const listingController = require("../controller/listings.js")
const {storage} = require("../cloudConfig.js")

const upload = multer({
        storage: storage,
        limits: { fileSize: 1000000 }, // 1 MB size limit
    });

// Route's

//create and index
router.route('/')
        .get(wrapAsync(listingController.index))
        .post(isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing))


// New 
router.get("/new",isLoggedIn, listingController.renderNewForm);        

// show, Update, delete 
router.route('/:id')
        .get(wrapAsync(listingController.showListing))
        .put(isLoggedIn,isOwnerOrAdmin, validateListing, wrapAsync(listingController.updateListing))
        .delete(isLoggedIn,isOwnerOrAdmin, wrapAsync(listingController.destroyListing));

// Edit  
router.get("/:id/edit",isLoggedIn,isOwnerOrAdmin, wrapAsync(listingController.renderEditForm));

module.exports = router;