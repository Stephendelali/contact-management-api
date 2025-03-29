const express = require('express');
const { registerUser,currentUser,loginUser } = require('../controllers/userController');
const ValidationToken = require('../middleware/validateTokenHandler');

const router = express.Router();

router.post("/register", registerUser);

router.post("/login",loginUser);
    
router.get("/current",ValidationToken,currentUser );
    
module.exports = router;