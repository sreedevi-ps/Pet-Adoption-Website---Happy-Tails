const express = require('express');
const router = express.Router();
const AdoptModel = require("../Models/adoptModel");
const PetModel = require("../Models/petModel");
const UserModel = require("../Models/userModel");


// Adopt a pet
router.post("/adopt/pet", async (req, res) => {
    try {
        const { name, emailId, petName, petId } = req.body;

        if (!name || !emailId || !petName || !petId) {
            return res.status(400).json({ status: false, msg: "Missing required fields" });
        }

        // Check if the pet exists and is available for adoption
        const pet = await PetModel.findOne({ petId: petId, name: petName, status: "Available" });

        if (!pet) {
            return res.status(404).json({ status: false, msg: "Pet not found or not available for adoption" });
        }

        // Check if the user already exists or create a new user
        let user = await UserModel.findOne({ emailId: emailId });

        if (!user) {
            user = new UserModel({
                name: name,
                emailId: emailId
            });
            await user.save();
        }

        // Check if the user already has adopted this pet
        const alreadyAdopted = await AdoptModel.findOne({ petId: petId, userId: user._id });

        if (alreadyAdopted) {
            return res.status(400).json({ status: false, msg: "You have already adopted this pet" });
        }

        // Update the pet's status to 'Adopted' and set the userId
        pet.status = "Adopted";
        pet.userId = user._id;
        await pet.save();

        // Create an adoption record
        const adoptionRecord = new AdoptModel({
            userId: user._id,
            petId: petId
        });
        await adoptionRecord.save();

        return res.status(200).json({
            status: true,
            msg: "Pet adopted successfully",
            pet: pet,
            user: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
});


// Check if a user exists
router.post("/user/check", async (req, res) => {
    try {
        const { emailId } = req.body;

        // Check if the user exists
        const user = await UserModel.findOne({ emailId: emailId });

        if (user) {
            return res.status(200).json({ status: true, msg: "User exists" });
        } else {
            return res.status(404).json({ status: false, msg: "User not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
});



// View adopted pets for admin
router.get('/admin/adopted-pets', async (req, res) => {
    try {
        // Find all adopted pets and populate user information
        const adoptedPets = await PetModel.find({ status: "Adopted" }).populate('userId', 'name emailId');

        if (!adoptedPets || adoptedPets.length === 0) {
            return res.status(200).json({ status: true, msg: 'No adopted pets found', adoptedPets: [] });
        }

        // Return the list of adopted pets with user information
        res.status(200).json({ status: true, msg: 'Adopted pets', adoptedPets: adoptedPets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, msg: 'Internal server error' });
    }
});
router.get('/pet/image/:petId', async (req, res) => {
    try {
      // Fetch the pet from the database
      const pet = await PetModel.findById(req.params.petId);
  
      // Check if the pet with the given ID exists
      if (!pet) {
        return res.status(404).json({ error: 'Pet not found' });
      }
  
      // Check if the pet has an image
      if (!pet.image || !pet.image.data) {
        return res.status(404).json({ error: 'Image not found for this pet' });
      }
  
      // Set the appropriate content type for the image
      res.contentType(pet.image.contentType);
  
      // Send the image data as a response
      res.send(pet.image.data);
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router;

