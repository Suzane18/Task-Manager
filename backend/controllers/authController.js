const User=require("../models/User");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

//generate JWT Token
const generateToken = (userId) =>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"7d"});
};

//@desc Register a new user
//@route POST /api/auth/register
//@access Public
const registerUser=async(req,res)=>{
    try{
        const {name,email,password,profileImageUrl,adminInviteToken}=req.body;
        //check if user already exists
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }
        //determine user role admin if correct token is provided otherwise member
        let role="member";
        if(adminInviteToken && adminInviteToken===process.env.ADMIN_INVITE_TOKEN){
            role="admin";
        }
        //hash password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        //create user
        const user=new User({
            name,
            email,
            password:hashedPassword,
            profileImageUrl,
            role
        });
        await user.save();
        //return user data with token
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,           
            role:user.role,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id)
        });
        
    }
    catch(error){
        res.status(500).json({message:"Server Error",error:error.message});
    }
};

//@desc Login user 
//@route POST /api/auth/login
//@access Public
const loginUser=async(req,res)=>{
     try{
        const {email,password}=req.body;
        //check if user exists
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
            console.log("User not found with email:",email);
        }
        //check if password is correct
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"});
        }
        //return user data with token
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id)
        });
     }
    catch(error){
        res.status(500).json({message:"Server Error",error:error.message});
    }
};

//desc @Get user profile
//@route GET /api/auth/profile
//@access Private {Require JWT}
const getUserProfile=async(req,res)=>{
     try{
        const user=await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.json(user);
     }
    catch(error){
        res.status(500).json({message:"Server Error",error:error.message});
    }
};    

//@desc @Update user profile
//@route PUT /api/auth/profile
//@access Private {Require JWT}
const updateUserProfile=async(req,res)=>{
     try{
        const user=await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        user.name=req.body.name || user.name;
        // prevent duplicate emails
        if (req.body.email && req.body.email !== user.email) {
            const existing = await User.findOne({ email: req.body.email });
            if (existing) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = req.body.email;
        }
        if(req.body.password){
            const salt=await bcrypt.genSalt(10);
            user.password=await bcrypt.hash(req.body.password,salt);
        }

        const updatedUser=await user.save();

        res.json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            role:updatedUser.role,
            token:generateToken(updatedUser._id)
        });
        
     }
    catch(error){
        res.status(500).json({message:"Server Error",error:error.message});
    }
};

module.exports={
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};
