const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const UserModel=require('../Models/userModel');
const PetModel = require('../Models/petModel');
const ReviewerModel = require("../Models/reviewerModel");
const randomstring = require('randomstring');
router.post("/pet/add/foradoption", upload.array("image", 3), async (req, res) => {
    try {
        const { name, age, breed, gender, place, category, username, emailId } = req.body;
        const images = req.files; // Array of uploaded images

        if (!images || images.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        // Check if a user with the provided emailId exists
        const existingUser = await UserModel.findOne({ emailId, name: username });

        if (!existingUser) {
            return res.status(400).json({ error: 'Invalid user' });
        }
        
        const newPet = new ReviewerModel();
        newPet.name = name;
        newPet.age = age;
        newPet.breed = breed;
        newPet.gender = gender;
        newPet.place = place;
        newPet.category = category;
        newPet.username = username;
        newPet.emailId = emailId;
        newPet.petId = await generateUniquePetId();
        newPet.images = images.map(file => ({
            data: file.buffer,
            contentType: file.mimetype
        }));
        
        await newPet.save();
        res.json({ message: "Pet added successfully", pet: newPet });
    } catch (error) {
        console.error("Error adding new pet:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
});


router.get('/pets', async (req, res) => {
    try {
        // Find all pets in the database
        const pets = await ReviewerModel.find({status:"Active"});

        // Check if pets are available
        if (!pets || pets.length === 0) {
            return res.status(404).json({ message: 'No pets found' });
        }

        // Format the pet data for response
        const formattedPets = pets.map(pet => ({
            _id: pet._id, // Ensure _id property is included
            name: pet.name,
            age: pet.age,
            breed: pet.breed,
            gender: pet.gender,
            place: pet.place,
            category: pet.category,
            username:pet.username,
            emailId:pet.emailId,
            images: pet.images.map(image => ({
                data: image.data.toString('base64'),
                contentType: image.contentType
            }))
        }));

        // Send the formatted pet data in the response
        res.json({ count: pets.length, pets: formattedPets });
    } catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Backend route to update the status of a pet to "deleted"
router.put("/pet/:id/reject", async (req, res) => {
    try {
        const petId = req.params.id;
        console.log('Received pet ID for deletion:', petId); // Log the received petId
        
        // Find the pet by ID and update its status
        const pet = await ReviewerModel.findOneAndUpdate(
            { _id: petId },
            { status: "Deleted" },
            { new: true }
        );

        if (!pet) {
            return res.status(404).json({ error: "Pet not found" });
        }

        res.json({ message: "Pet status updated successfully", pet });
    } catch (error) {
        console.error("Error updating pet status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// Define endpoint for fetching pet details
router.get('/pets/:id', async (req, res) => {
    try {
        // Find pet by ID in the database
        const pet = await ReviewerModel.findById(req.params.id);

        // Check if pet is found
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        // Send pet details in JSON response
        res.json({ pet });
    } catch (error) {
        console.error('Error fetching pet details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define endpoint for approving and saving pet
// Define endpoint for approving and saving pet
router.put("/pet/:id/approve", async (req, res) => {
    try {
        const petId = req.params.id;
        const petDetails = req.body.pet; // Extract the pet object from the request body

        console.log('Received pet details:', petDetails); // Log received pet details

        // Extract the first image from the array of images
        const firstImage = petDetails.images && petDetails.images.length > 0 ? petDetails.images[0] : null;

        // Create a new pet object with the extracted image and other details
        const newPet = new PetModel({
            name: petDetails.name,
            age: petDetails.age,
            breed: petDetails.breed,
            petId:await generateUniquePetId(),
            gender: petDetails.gender,
            place: petDetails.place,
            category: petDetails.category,
            username: petDetails.username, // Add username field
            emailId: petDetails.emailId, // Add emailId field
            image: firstImage ? { data: firstImage.data, contentType: firstImage.contentType } : null
        });

        console.log('New Pet object:', newPet); // Log the new Pet object before saving

        // Save the new pet to the database
        const savedPet = await newPet.save();

        console.log('Saved Pet:', savedPet); // Log the saved pet

        // Update the status of the pet to "Approved" in the database
        const updatedPet = await ReviewerModel.findByIdAndUpdate(
            petId,
            { status: "Approved" },
            { new: true } // Return the updated document
        );

        if (!updatedPet) {
            return res.status(404).json({ error: "Pet not found" });
        }

        // Send response with success message and saved pet data
        res.status(200).json({ message: 'Pet approved and saved successfully', pet: savedPet });
    } catch (error) {
        console.error("Error approving and saving pet:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

async function generateUniquePetId() {
    var petId = randomstring.generate({
        length: 4,
        charset: 'numeric'
    });
    
    var existingPetlist = await PetModel.findOne({ petId: petId });
    var existingReviewerlist = await ReviewerModel.findOne({ petId: petId });

    if (existingPetlist || existingReviewerlist ) {
        return generateUniquePetId(); // Recursively generate a new petId
    } else {
        return petId;
    }
}

module.exports = router;