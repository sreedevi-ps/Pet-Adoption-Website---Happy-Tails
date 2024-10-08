const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const Volunteer = require('../Models/volunteerModel');
// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "happytailsmini2024@gmail.com", 
  
  
      pass: "cndx tzes hbqf obov",
    },
  });
  // Route for sending approval or rejection emails
  router.post("/volunteer/send-email", async (req, res) => {
    try {
        const { email, subject, content } = req.body;

        // Find the user with the passed email and set status to "Mailed"
        const volunteer = await Volunteer.findOneAndUpdate(
            { email: email },
            { $set: { status: "Mailed" } },
            { new: true }
        );

        if (!volunteer) {
            return res.status(404).json({ success: false, message: "Volunteer not found" });
        }

        // Sending email
        const mailOptions = {
            from: 'happytailsmini2024@gmail.com', // Change this to your email address
            to: email,
            subject: subject,
            html: content
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                res.status(500).json({ success: false, message: "Failed to send email" });
            } else {
                console.log("Email sent:", info.response);
                res.status(200).json({ success: true, message: "Email sent successfully" });
            }
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});



// Route for volunteer registration
router.post('/volunteer/register', async (req, res) => {
    try {
        const {
            email,
            fullname,
            contact,
            address,
            occupation,
            how_know,
            visited_shelter,
            volunteer_options,
            other_ways,
            latest_info,
            storytelling,
            newsletter,
            donation_method,
            suggestions,
            
        } = req.body;

        // Create a new instance of the Volunteer model
        const newVolunteer = new Volunteer({
            email,
            fullname,
            contact,
            address,
            occupation,
            how_know,
            visited_shelter,
            volunteer_options,
            other_ways,
            latest_info,
            storytelling,
            newsletter,
            donation_method,
            suggestions
        });

        await newVolunteer.save();
        console.log(newVolunteer);
         console.log(newVolunteer._id);
        // Respond with success message
        res.status(200).json({ success: true, message: "Volunteer registered successfully" });
    } catch (error) {
        // Handle errors
        console.error("Error registering volunteer:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
router.get("/volunteer/list", async (req, res) => {
    try {
        // Assuming you have a VolunteerModel to fetch volunteers
        const volunteers = await Volunteer.find({ status:"Active"});

        if (!volunteers || volunteers.length === 0) {
            return res.status(404).json({ message: "No volunteers found" });
        }

        // Extracting relevant data for each volunteer
        const volunteerList = volunteers.map(volunteer => ({
            email: volunteer.email,
            fullname: volunteer.fullname,
            contact: volunteer.contact,
            address: volunteer.address,
            occupation: volunteer.occupation,
            how_know: volunteer.how_know,
            visited_shelter: volunteer.visited_shelter,
            volunteer_options: volunteer.volunteer_options,
            other_ways: volunteer.other_ways,
            latest_info: volunteer.latest_info,
            storytelling: volunteer.storytelling,
            newsletter: volunteer.newsletter,
            donation_method: volunteer.donation_method,
            suggestions: volunteer.suggestions
        }));

        res.json({ count: volunteerList.length, volunteers: volunteerList });
    } catch (error) {
        console.error("Error fetching volunteers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
