// Import required libraries
const express = require("express");
const router = express.Router();
const bcryptjs = require('bcryptjs');
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const UserModel = require("../Models/userModel");
const AdminModel = require("../Models/adminModel");

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "happytailsmini2024@gmail.com", 


    pass: "cndx tzes hbqf obov",
  },
});

// Route for handling forgot password request
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists with the provided email
    const user = await UserModel.findOne({ emailId:email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    // Store OTP in the database with user's email
    user.passwordResetOTP = otp;
    await user.save();

    // Send OTP to the user's email
    const mailOptions = {
      from: "happytailsmini2024@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send OTP" });
      }
      console.log("Email sent:", info.response);
      res.json({ message: "OTP sent successfully" });
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for handling forgot password request
router.post("/admin/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists with the provided email
    const user = await AdminModel.findOne({ emailId:email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    // Store OTP in the database with user's email
    user.passwordResetOTP = otp;
    await user.save();

    // Send OTP to the user's email
    const mailOptions = {
      from: "happytailsmini2024@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send OTP" });
      }
      console.log("Email sent:", info.response);
      res.json({ message: "OTP sent successfully" });
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        // Log incoming data for debugging
        console.log("Reset password request received with data:", req.body);

        // Check if the OTP matches the one stored in the database
        const user = await UserModel.findOne({ emailId: email });

        if (!user || user.passwordResetOTP !== otp) {
            // Log the invalid OTP error for debugging
            console.log("Invalid OTP or user not found");
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Check if newPassword matches confirmPassword
        if (newPassword !== confirmPassword) {
            // Log the passwords mismatch error for debugging
            console.log("New password and confirm password do not match");
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Check if newPassword meets the minimum length requirement
        if (newPassword.length < 8) {
            return res.status(400).json({
                error: "Password should be at least 8 characters long",
            });
        }

        // Hash the new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        // Update user's password with the hashed password
        user.password = hashedPassword;
        user.passwordResetOTP = null; // Clear OTP

        // Save the updated user
        await user.save();

        // Log password reset success
        console.log("Password reset successfully for user:", user.emailId);

        // Send success response
        res.json({ message: "Password reset successfully" });
    } catch (error) {
        // Log any errors that occur during the password reset process
        console.error("Error in reset password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/admin/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        // Log incoming data for debugging
        console.log("Reset password request received with data:", req.body);

        // Check if the OTP matches the one stored in the database
        const user = await AdminModel.findOne({ emailId: email });

        if (!user || user.passwordResetOTP !== otp) {
            // Log the invalid OTP error for debugging
            console.log("Invalid OTP or user not found");
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Check if newPassword matches confirmPassword
        if (newPassword !== confirmPassword) {
            // Log the passwords mismatch error for debugging
            console.log("New password and confirm password do not match");
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Check if newPassword meets the minimum length requirement
        if (newPassword.length < 8) {
            return res.status(400).json({
                error: "Password should be at least 8 characters long",
            });
        }

        // Hash the new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        // Update user's password with the hashed password
        user.password = hashedPassword;
        user.passwordResetOTP = null; // Clear OTP

        // Save the updated user
        await user.save();

        // Log password reset success
        console.log("Password reset successfully for user:", user.emailId);

        // Send success response
        res.json({ message: "Password reset successfully" });
    } catch (error) {
        // Log any errors that occur during the password reset process
        console.error("Error in reset password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
