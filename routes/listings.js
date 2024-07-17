const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require('multer');
const {isLoggedIn , isOwnerOrAdmin, validateListing} = require("../middleware.js");
const path = require("path");
const listingController = require("../controller/listings.js")

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Route's

//create and index
router.route('/')
        .get(wrapAsync(listingController.index))
        .post(upload, validateListing, wrapAsync(listingController.createListing));

// New 
router.get("/new",isLoggedIn, listingController.renderNewForm);        

// show, Update, delete 
router.route('/:id')
        .get(wrapAsync(listingController.showListing))
        .put(isLoggedIn,isOwnerOrAdmin, upload, validateListing, wrapAsync(listingController.updateListing))
        .delete(isLoggedIn,isOwnerOrAdmin, wrapAsync(listingController.destroyListing));

// Edit  
router.get("/:id/edit",isLoggedIn,isOwnerOrAdmin, wrapAsync(listingController.renderEditForm));

module.exports = router;