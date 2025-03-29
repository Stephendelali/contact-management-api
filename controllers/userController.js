const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); 

// @desc Register a new user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    
    // Validation
    if (!username || !email || !password){
        res.status(400);
        throw new Error("Please fill in all fields");
    }
    
    // Check if user exists
    const userAvailable = await User.findOne({email});
    if (userAvailable){
        res.status(400);
        throw new Error("User already exists");
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPassword);
        
        // Create user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        console.log("User created:", newUser);
        
        if (newUser) {
            res.status(201).json({
                _id: newUser.id,
                email: newUser.email,
                username: newUser.username
            });
        } else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500);
        throw new Error("Registration failed");
    }
});

// @desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password){
        res.status(400);
        throw new Error ("Please fill in all fields");
    }
    const user = await User.findOne({email});
    //Compare password with hashed password
    if (user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                username: user.username,
                email: user.email,
                id : user._id
            }
        }, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"}
    );
        res.status(200).json({accessToken})
    } else {
        res.status(401)
        throw new Error ("email or password is not valid");
    }
});

// @desc Current user information
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    currentUser,
}
