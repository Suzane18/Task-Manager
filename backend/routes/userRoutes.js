const express=require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, updateProfile, removeProfileImage, deleteAccount } = require("../controllers/userController");

const upload = require('../middlewares/uploadMiddleware');
const router=express.Router();

//User Management Route
router.get("/", protect, getUsers); //get all users (accessible to authenticated users)
router.get("/:id",protect,getUserById); //get a specific user by id

// Update current user's profile (name and optional profile image)
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

// Remove current user's profile image
router.delete('/profile/image', protect, removeProfileImage);

// Delete current user's account
router.delete('/profile', protect, deleteAccount);

module.exports=router;