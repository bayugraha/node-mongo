const express = require('express');
const router = express.Router();
const Post = require('../models/postSchema');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().getTime() + '_' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize:500000 },
    fileFilter: function(req, file, callback){
        validateFile(file, callback);
    }
});

const validateFile = function(file, cb ){
    const type = allowedFileTypes = /jpeg|jpg|png/;
    const extension = type.test(path.extname(file.originalname).toLowerCase());
    const mimeType  = type.test(file.mimetype);
    if(extension && mimeType){
      return cb(null, true);
    }else{
      cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
    }
}

//GET ALL DATA
router.get('/getData', async (req,res)=>{
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.json({massage: err});        
    }
});

//SUBMITS A POST
router.post('/post', upload.single('eventImage'), async (req,res) => {
    const post = new Post({
        title: req.body.title,
        event: req.body.event,
        description: req.body.description,
        eventImages: req.file.filename
    });

    try {
        const savedPost = await post.save()
        res.json(savedPost);
    } catch (err) {
        res.json({massage: err});
    }
    
});

//SPECIFIC FIND ID
router.get('/search/:postId', async (req,res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    } catch (err) {
        res.json({massage: err});
    }
});

//SPECIFIC FIND TITLE
router.get('/search/findOne/:Title', async (req,res) => {
    try {
        const post = await Post.findOne({title:req.params.Title});
        res.json(post);
    } catch (err) {
        res.json({massage: err});
    }
});

//SPECIFIC FIND TITLE WITH LIKE
router.get('/search/posts/:Title', async (req,res) => {
    try {
        const post = await Post.find({title:{$regex: req.params.Title}});
        res.json(post);
    } catch (err) {
        res.json({massage: err});
    }
});

//Delete POST
router.delete('/delete/:postId', async (req,res) => {
    try {
        const removedPost = await Post.remove({_id: req.params.postId});
        res.json(removedPost);
    } catch (err) {
        res.json({massage: err});
    }
});

router.patch('/update/:postId', async (req,res) => {
    try {
        const updatedPost = await Post.updateOne(
            {_id: req.params.postId},
            {$set: {title: req.body.title,
                description: req.body.description}
            }
        );
        res.json(updatedPost);
    } catch (err) {
        res.json({massage: err});
    }
});

module.exports = router;