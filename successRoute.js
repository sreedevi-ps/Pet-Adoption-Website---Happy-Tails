const express = require('express');
const router = express.Router();
const multer = require('multer');
var SuccessStoryModel = require('../Models/SuccessStoryModel');
var randomstring=require('randomstring');

// Configure Multer to store uploaded files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to add a new success story with image
router.post("/success/add", upload.single("image"), async (req, res) => {
    try {
        // Extract data from request body
        const { title, content, author } = req.body;

        // Ensure all required fields are provided
        if (!title || !content || !author || !req.file) {
            return res.status(400).json({ error: "Please provide title, content, author, and image" });
        }

        // Create a new SuccessStory instance
        const newsuccess = new SuccessStoryModel();
            newsuccess.title=title;
            newsuccess.content=content;
            newsuccess.author=author;
            newsuccess.storyId = await generateUniqueStoryId();
            newsuccess.image={
                data: req.file.buffer,
                contentType: req.file.mimetype,
            }
        

        // Save the success story to the database
        await newsuccess.save();
       

        // Respond with success message and details of the added success story
        res.status(200).json({
            status: true,
            msg: "Success story added successfully",
            successStory: newsuccess,
        });
    } catch (error) {
        console.error("Error adding new success story:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




async function generateUniqueStoryId() {
    var storyId = randomstring.generate({
        length: 4,
        charset: 'numeric'
    });
    
    var existingStory = await SuccessStoryModel.findOne({ storyId: storyId });

    if (existingStory) {
        return generateUniqueStoryId(); // Recursively generate a new storyId
    } else {
        return storyId;
    }
}



router.get("/success/list", async (req, res) => {
    try {
        // Fetch all pets from the database
        const stories = await SuccessStoryModel.find({status:"Active"});

        // If no pets found, send an appropriate response
        if (!stories || stories.length === 0) {
            return res.status(404).json({ message: "No stories found" });
        }

        // Map the pets to include only necessary information (name and image)
        const storyList = stories.map(story => ({
            title: story.title,
            content:story.content,
            author:story.author,
            storyId:story.storyId,

            image: `data:${story.image.contentType};base64,${story.image.data.toString("base64")}`
        }));

        // Send the list of pets with their names and images
        res.json({ count: storyList.length, stories: storyList });
    } catch (error) {
        console.error("Error fetching stories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/success/edit", upload.single("image"), async (req, res) => {
    try {
        const { id,title,content,author } = req.body;

        if (!id) {
            return res.status(400).json({ status: false, msg: "Invalid ID" });
        }

        if (!title) {
            return res.status(400).json({ status: false, msg: "Invalid title" });
        }

        if (!content) {
            return res.status(400).json({ status: false, msg: "Invalid content" });
        }

        if (!author) {
            return res.status(400).json({ status: false, msg: "Invalid breed" });
        }

        

       
        let story = await SuccessStoryModel.findOne({storyId:id});
        if (!story) {
            return res.status(404).json({ status: false, msg: "story not found" });
        }
       story.title=title;
       story.content=content;
       story.author=author;
        // If a new image is uploaded, update the image data
        if (req.file) {
            story.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        await story.save();

        res.status(200).json({ status: true, msg: "story updated successfully", story });
    } catch (error) {
        console.error("Error editing story:", error);
        res.status(500).json({ status: false, error: "Internal Server Error" });
    }
});




router.post("/success/delete", async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            res.status(400).json({
                status: false,
                msg: "Invalid story ID"
            });
            return;
        }

        // Find the pet by ID
        const success = await SuccessStoryModel.findOne({ storyId: id });

        if (!success) {
            res.status(404).json({
                status: false,
                msg: "story not found"
            });
            return;
        }

        // Update the status of the found pet to "Deleted"
        success.status = "Deleted";
        await success.save();

        res.status(200).json({
            status: true,
            msg: "story deleted successfully",
            deletedStory: success
        });
    } catch (error) {
        console.error("Error deleting story:", error);
        res.status(500).json({
            status: false,
            msg: "Internal Server Error"
        });
    }
});


module.exports = router;
