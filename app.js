const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const multer = require('multer');
const fs = require('fs');

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/TrekToDo")
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

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


// home page
app.get("/", (req, res) => {
    res.render("listings/home.ejs");
});

// validation Error Listing 
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// SHOW Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

// Create Route
app.post("/listings", upload, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    if (req.file) {
        newListing.image = `/uploads/${req.file.filename}`;
    }

    await newListing.save();
    res.redirect("listings");
}));

// Edit Route 
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// Update Route
app.put("/listings/:id", upload, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (req.file) {
        listing.image = `/uploads/${req.file.filename}`;
    } else if (!req.body.listing.image) {
        listing.image = listing.schema.path('image').defaultValue;
    }

    await listing.save();
    res.redirect(`/listings/${id}`);
}));


// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// Error Test
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found?"))
});

// Error Handler 
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "SomeThing Went Wrong!" } = err;
    res.status(statusCode).render("listings/error", { err });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => { console.log(`port is working: 8080`) });
