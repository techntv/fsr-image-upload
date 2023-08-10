// backend/routes/index.js
const express = require("express")
const router = express.Router(); // Ge the router instance of Express
const { handleSignup, handleVerifyEmail, handleLogin } = require("../controllers/user"); // Get all exported functions in the user controller
const { handleUpload, handleGetAllFiles, handleGetFile, handleSearchFile, handleUpdateFile, handleDeleteFile } = require("../controllers/file");
const auth = require("../middleware/auth");
const { upload } = require("../middleware/multer");

// Map the `signup` request to the signup function
router.post("/signup", handleSignup);
router.get("/verify/:confirmationToken", handleVerifyEmail);
router.post("/login", handleLogin);


// File Routes
router.post("/upload", auth, upload.single("file"), handleUpload);

router.get("/file/:createdBy", auth, handleGetAllFiles);

router.get("/file/:createdBy/:fileId", auth, handleGetFile);

router.get("/file", handleSearchFile);

router.put("/file/:_id", auth, handleUpdateFile);

router.delete("/file/:_id", auth, handleDeleteFile);


module.exports = router;