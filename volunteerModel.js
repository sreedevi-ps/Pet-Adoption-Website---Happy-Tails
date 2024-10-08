const mongoose = require('mongoose');

// Define the Volunteer schema
const volunteerSchema = new mongoose.Schema({
    email: {
        type: String,
        
    },
    fullname: {
        type: String,
        
    },
    contact: {
        type: String,
        
    },
    address: {
        type: String,
        
    },
    occupation: {
        type: String,
       
    },
    how_know: {
        type: String,
        
    },
    visited_shelter: {
        type: String,
       
    },
    volunteer_options: {
        type: String,
        
    },
    other_ways: {
        type: String
    },
    latest_info: {
        type: String,
    
    },
    storytelling: {
        type: String,
        
    },
    newsletter: {
        type: String,
        
    },
    donation_method: {
        type: String,
        
    },
    suggestions: {
        type: String,
        
    },
    status:{ type:String, default:"Active"}
});

// Create the Volunteer model
const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;
