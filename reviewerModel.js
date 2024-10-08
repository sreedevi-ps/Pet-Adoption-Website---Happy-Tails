const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewerSchema = new Schema({
    userid:{type:mongoose.Schema.Types.ObjectId,ref:"userModel"},
    reviewerid:{type:mongoose.Schema.Types.ObjectId,ref:"adminModel"},
    username:{
        type: String,
    },
    emailId:{
        type :String ,
    },
    status:{
        type:String, default:"Active"
    },
    name: {
        type: String,
    },
    age: {
        type: Number,
    },
    breed: {
        type: String,
    },
    gender: {
        type: String,
    },
    place: {
        type: String,
    },
    category: {
        type: String,
    },
    reviewerName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    orgName: {
        type: String,
    },
    images: [{
        data: Buffer, // Storing binary image data
        contentType: String // MIME type of the image
    }]
});

const ReviewerModel = mongoose.model('Reviewer', reviewerSchema);

module.exports = ReviewerModel;
