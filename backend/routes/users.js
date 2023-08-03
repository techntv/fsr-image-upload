// backend/routes/index.js
const express = require("express")
const router = express.Router(); // Ge the router instance of Express
const { handleSignup } = require("../controllers/user"); // Get all exported functions in the user controller

// Map the `signup` request to the signup function
router.post("/signup", handleSignup);

module.exports = router;