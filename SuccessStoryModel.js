const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    status:{ type:String,default:"Active"},
    storyId:{ type:Number}
});

const SuccessStoryModel = mongoose.model('successstories', successStorySchema); // Use 'SuccessStory' instead of 'SuccessStoryModel'

// Export the model
module.exports = SuccessStoryModel;
