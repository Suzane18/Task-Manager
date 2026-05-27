// replaced by rebuilt file below

const User=require("../models/User");
const Task = require("../models/Task");
const bcrypt=require("bcryptjs");

//@desc Get all users (admin only)
//@route GET /api/users
//@access Private (Admin only)
const getUsers=async(req,res)=>{
    try{
        const users=await User.find({role:"member"}).select("-password");

        //add task counts to each user
        const usersWithTaskCounts=await Promise.all(
            users.map(async(user)=>{
            const pendingTasks=await Task.countDocuments({
                assignedTo:user._id,
                status:"Pending"
            });
            const inProgressTasks=await Task.countDocuments({
                assignedTo:user._id,
                status:"In Progress"
            });
            const completedTasks=await Task.countDocuments({
                assignedTo:user._id,
                status:"Completed"
            });
            return {...user._doc,  //Include all user fields except password
                pendingTasks,
                inProgressTasks,
                completedTasks};
        }));
        res.json(usersWithTaskCounts);
    }
    catch(error){
        res.status(500).json({message:"Server Error",error:error.message});
    }
}

//@desc Get a specific user by id
//@route GET /api/users/:id
//@access Private
const getUserById=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.json(user);
    }
    catch(error){
        res.status(500).json({message:"Server Error",error:error.message});
    }
};




//@desc Update current user profile (name and profile image)
//@route PUT /api/users/profile
//@access Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name } = req.body;
        if (name) user.name = name;

        if (req.file) {
            // store relative path for frontend to fetch
            user.profileImageUrl = `/uploads/${req.file.filename}`;
        }

        await user.save();
        const userObj = user.toObject();
        delete userObj.password;
        res.json({ message: 'Profile updated', user: userObj });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

//@desc Remove current user's profile image
//@route DELETE /api/users/profile/image
//@access Private
const removeProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.profileImageUrl) {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, '..', user.profileImageUrl);
            // delete file if exists
            try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (err) {
                // ignore file deletion errors
            }
            user.profileImageUrl = '';
            await user.save();
        }

        const userObj = user.toObject();
        delete userObj.password;
        res.json({ message: 'Profile image removed', user: userObj });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc Delete current user's account
// @route DELETE /api/users/profile
// @access Private
const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // remove user's profile image file if exists
        if (user.profileImageUrl) {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, '..', user.profileImageUrl);
            try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            } catch (err) {
                // ignore file deletion errors
            }
        }

        // remove user reference from tasks assignedTo arrays
        await Task.updateMany({}, { $pull: { assignedTo: user._id } });

        // finally remove user document
        await user.remove();

        res.json({ message: 'Account deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateProfile,
    removeProfileImage,
        deleteAccount,
};