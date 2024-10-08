const express = require("express");
const router = express.Router();
const UserModel = require("../Models/userModel");
const bcryptjs = require("bcryptjs");
const AdoptModel = require("../Models/adoptModel");
const PetModel = require("../Models/petModel");


router.post("/user/register", async (req, res) => {
    try {
        const { name, emailId, password, address, contactNo, pincode, city } = req.body;

        // Check if any required field is missing
        if (!name || !emailId || !password || !address || !contactNo || !pincode || !city) {
            return res.status(400).json({ status: false, msg: "All fields are required" });
        }

        // Check if the email already exists
        const existingUser = await UserModel.findOne({ emailId: emailId });
        if (existingUser) {
            return res.status(400).json({ status: false, msg: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create a new user
        const newUser = new UserModel()
            
  newUser.name = name;
  newUser.emailId = emailId;
  newUser.password = hashedPassword;
  newUser.address = address;
  newUser.role = "user";
  newUser.contactNo = contactNo;
  newUser.pincode=pincode;
  newUser.city=city;

        

        // Save the user to the database
        await newUser.save();

        res.status(200).json({ status: true, msg: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Error in user registration:", error);
        res.status(500).json({ status: false, msg: "Internal server error" });
    }
});

router.post("/user/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Check if email and password are provided
        if (!emailId || !password) {
            return res.status(400).json({ status: false, msg: "Email and password are required" });
        }

        // Find the user by email
        const user = await UserModel.findOne({ emailId: emailId });
        if (!user) {
            return res.status(400).json({ status: false, msg: "User not found" });
        }

        // Compare passwords
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ status: false, msg: "Invalid password" });
        }

        res.status(200).json({ status: true, msg: "Login successful" });
    } catch (error) {
        console.error("Error in user login:", error);
        res.status(500).json({ status: false, msg: "Internal server error" });
    }
});

router.get("/user/profile/:emailId", async (req, res) => {
    try {
        const userEmail = req.params.emailId;

        // Find the user by email
        const user = await UserModel.findOne({ emailId: userEmail });
        if (!user) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }

        // Find adopted pets for the user
        const adoptedPets = await AdoptModel.find({ userId: user._id });

        if (!adoptedPets || adoptedPets.length === 0) {
            return res.status(200).json({ status: true, msg: "No adopted pets found for this user", user: user, adoptedPets: [] });
        }

        // Create an array to store adopted pet details
        const adoptedPetDetails = [];

        // Fetch pet details for each adopted pet
        for (const adoption of adoptedPets) {
            // Find the pet by its ID
            const pet = await PetModel.findOne({ petId: adoption.petId });

            if (pet) {
                // Convert image data to Base64 string
                const imageData = pet.image.data.toString("base64");

                // Push pet details to the adoptedPetDetails array
                adoptedPetDetails.push({
                    _id: adoption._id,
                    petId: pet.petId, // Assuming you want to keep the petId as number
                    name: pet.name,
                    image: `data:${pet.image.contentType};base64,${imageData}`, // Include image data as Base64 string
                    // Add other fields as needed
                });
            }
        }

        res.status(200).json({ status: true, msg: "User profile and adopted pets", user: user, adoptedPets: adoptedPetDetails });
    } catch (error) {
        console.error("Error in fetching user profile and adopted pets:", error);
        res.status(500).json({ status: false, msg: "Internal server error" });
    }
});


























module.exports = router;
