const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    name: String,
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }
});

module.exports = mongoose.model('Listing', listingSchema);
