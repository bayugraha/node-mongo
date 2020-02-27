const router = require('express').Router();
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('./validation');

//GET ALL DATA
router.get('/getData', async (req,res)=>{
    try {
        const posts = await User.find();
        res.json(posts);
    } catch (err) {
        res.json({massage: err});        
    }
});

// CREATE USER
router.post('/register', async (req,res) => {
    //VALIDATION THE DATA BEFORE ADD USER
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking the user is already in the database or not
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('Email already exists!!!');

    //Hash passwords
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create New User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save()
        res.json({user: user._id});
    } catch (err) {
        res.json({massage: err});
    }
});

// LOGIN
router.post('/login', async (req,res) => {
    //VALIDATION THE DATA BEFORE LOGIN USER
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking the email exists
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email not found...');

    //Checking password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password...');
    
    //Create abd assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;