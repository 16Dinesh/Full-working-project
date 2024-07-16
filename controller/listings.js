const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    //console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate: {path : "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing Don't Exist - Error 404");
        res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    if (req.file) {
        newListing.image = `/uploads/${req.file.filename}`;
    }
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("done", "New Listing Created")
    res.redirect("listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing Link does not Exist - Error 404");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (req.file) {
        listing.image = `/uploads/${req.file.filename}`;
    } else if (!req.body.listing.image) {
        listing.image = listing.schema.path('image').defaultValue;
    }

    await listing.save();
    req.flash("done", "Listing Updated")
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    //console.log(deletedListing);
    req.flash("done", "Listing Deleted")
    res.redirect("/listings");
}