const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/TrekToDo")
}

app.set("view engine" , "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res) => {res.send("Root page")});


//Index Route
app.get("/listings", wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
}))

//New Route
app.get("/listings/new",  (req,res) => {
    res.render("listings/new.ejs");
})

//SHOW Route
app.get("/listings/:id",wrapAsync( async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", {listing})
}));

//Create Route
app.post("/listings",wrapAsync( async (req,res , next) => { 
    if(!req.body.listing){
        throw new ExpressError(400, "Bad Request - Send Valid Request" )
    }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("listings")
}));

//Edit Route 
app.get("/listings/:id/edit", wrapAsync(async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}))

//Update Route
app.put("/listings/:id" , wrapAsync(async (req,res) => {
    if(!req.body.listing){
        throw new ExpressError(400, "Bad Request - Send Valid Request" )
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}))


//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


//Testing Route
// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing({
//         title : "not found Image",
//         description : "Sun Set",
//         price : 1200,
//         location: "Unknown",
//         country : "Unknown"
//     });

//     await sampleListing.save();
//     console.log("sample is saved");
//     res.send("data is injected")
// })

// Error Test
app.all("*" , (req,res,next) => {
    next(new ExpressError(404, "Page not Found?"))
})

//Error Handler 
app.use((err, req, res, next) => {
    let {statusCode = 500 ,message = "SomeThing Went Wrong!"} = err;
    res.status(statusCode).render("listings/error", {err})
    // res.status(statusCode).send(message);
}) 


app.listen(8080, ()=> {console.log(`port is working: 8080`)});