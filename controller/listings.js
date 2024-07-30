const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    //console.log(req.user);
    res.render("listings/new.ejs", { user: req.user });
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
    const url = req.file.path;
    const filename = req.file.filename;
    //console.log(url, "..." , fileName)
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename}
    await newListing.save();
    req.flash("done", "New Listing Created")
    res.redirect("listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing Link does not Exist - Error 404");
        return res.redirect("/listings");
    }
    
    // Pass the logged-in user and allowedUserId to the view
    res.render("listings/edit.ejs", { listing, localuser: req.user });
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

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