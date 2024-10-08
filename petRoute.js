const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const PetModel = require("../Models/petModel");
const randomstring=require('randomstring');

router.post("/pet/add", upload.single("image"), async (req, res) => {
    try {
        const { name, age, breed, gender, place, Adoption_status, category, } = req.body;
        
        const newPet = new PetModel();
            newPet.name=name;
            newPet.age=age;
            newPet.breed=breed;
            newPet.gender=gender;
            newPet.place=place;
            newPet.Adoption_Status=Adoption_status;
            newPet.category=category;
            newPet.petId=await generateUniquePetId();
            newPet.image= {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            }
           
        

        await newPet.save();
        res.json({ message: "Pet added successfully", pet: newPet });
    } catch (error) {
        console.error("Error adding new pet:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

async function generateUniquePetId() {
    var petId = randomstring.generate({
        length: 4,
        charset: 'numeric'
    });
    
    var existingPet = await PetModel.findOne({ petId: petId });

    if (existingPet) {
        return generateUniquePetId(); // Recursively generate a new petId
    } else {
        return petId;
    }
}



router.get("/list/pets", async (req, res) => {
    try {
        
        const pets = await PetModel.find({status:"Available"});

      
        if (!pets || pets.length === 0) {
            return res.status(404).json({ message: "No pets found" });
        }
       
        
        
        
    const petList = pets.map(pet => ({
    id: pet._id, // Include MongoDB ObjectId
    petId: pet.petId, // Include petId
    name: pet.name,
    breed: pet.breed,
    gender: pet.gender,
    
    image: `data:${pet.image.contentType};base64,${pet.image.data.toString("base64")}`
}));

        
        res.json({ count: petList.length, pets: petList });
    } catch (error) {
        console.error("Error fetching pets:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
  
router.get('/search-and-view/pet', async (req, res) => {
    try {
        const name = req.query.name;
        
        const pets = await PetModel.find({ 
            name: { $regex: new RegExp(name, 'i') },
            status: 'Available' 
        }).populate('category'); // Populate the 'category' field
        
        if (pets.length === 0) {
            return res.status(404).json({ message: 'No available pets found' });
        }
        
        const pet = pets[0]; 

        console.log("Populated Pet:", pet); // Debugging

        const category = pet.category;
        console.log("Populated Category:", category); // Debugging

        const imageData = pet.image.data.toString('base64');
        const imageSrc = `data:${pet.image.contentType};base64,${imageData}`;
       
        res.json({ 
            pet: {
                id: pet._id, // Include pet ID
                name: pet.name,
                image: imageSrc,
                age: pet.age,
                breed: pet.breed,
                gender: pet.gender,
                Adoption_status:pet.Adoption_Status,
                petId:pet.petId,
                category: category // Access category name directly
            }
        });
    } catch (error) {
        console.error('Error searching and viewing pet:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.post("/pet/edit", upload.single("image"), async (req, res) => {
    try {
        const { id, name, age, breed, gender, Adoption_status, category } = req.body;

        if (!id) {
            return res.status(400).json({ status: false, msg: "Invalid ID" });
        }

        if (!name) {
            return res.status(400).json({ status: false, msg: "Invalid name" });
        }

        if (!age) {
            return res.status(400).json({ status: false, msg: "Invalid age" });
        }

        if (!breed) {
            return res.status(400).json({ status: false, msg: "Invalid breed" });
        }

        if (!gender) {
            return res.status(400).json({ status: false, msg: "Invalid gender" });
        }

        if (!Adoption_status) {
            return res.status(400).json({ status: false, msg: "Invalid status" });
        }

        if (!category) {
            return res.status(400).json({ status: false, msg: "Invalid category name" });
        }

       
        let pet = await PetModel.findOne({petId:id});
        if (!pet) {
            return res.status(404).json({ status: false, msg: "Pet not found" });
        }

        
        

        
        pet.name = name;
        pet.age = age;
        pet.breed = breed;
        pet.gender = gender;
        pet.Adoption_status = Adoption_status;
        pet.category = category; 

        if (req.file) {
            pet.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        await pet.save();

        res.status(200).json({ status: true, msg: "Pet updated successfully", pet });
    } catch (error) {
        console.error("Error editing pet:", error);
        res.status(500).json({ status: false, error: "Internal Server Error" });
    }
});

router.post("/pet/delete", async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            res.status(400).json({
                status: false,
                msg: "Invalid pet ID"
            });
            return;
        }

        
        const pet = await PetModel.findOne({ petId: id });

        if (!pet) {
            res.status(404).json({
                status: false,
                msg: "Pet not found"
            });
            return;
        }

        
        pet.status = "Deleted";
        await pet.save();

        res.status(200).json({
            status: true,
            msg: "Pet deleted successfully",
            deletedPet: pet
        });
    } catch (error) {
        console.error("Error deleting pet:", error);
        res.status(500).json({
            status: false,
            msg: "Internal Server Error"
        });
    }
});

router.get("/pet/:id", async (req, res) => {
    try {
        const petId = req.params.id;

        // Find the pet by its ID
        const pet = await PetModel.findOne({ petId });

        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // Construct the response with the pet's details
        const responseData = {
            pet: {
                id: pet.petId,
                name: pet.name,
                age: pet.age,
                breed: pet.breed,
                gender: pet.gender,
                Adoption_status: pet.Adoption_Status,
                category: pet.category
                // Add other details as needed
            }
        };

        res.json(responseData);
    } catch (error) {
        console.error("Error fetching pet details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;
