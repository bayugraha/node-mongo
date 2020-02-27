const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const path = require('path');

app.use(bodyParser.json());

// Import Routers
const postsRoute = require ('./api/routes/posts');
const authRoute = require ('./api/routes/auth');

// MiddleWare
app.use(express.json());
// Route MiddleWare
app.use('/api/dashboard', postsRoute);
app.use('/api/user', authRoute);

//ROUTES
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, './views/login.html'));
});

app.get('/dashboard', (req,res)=>{
    console.log(res);
    
    // res.sendFile(path.join(__dirname, './views/index.html'));
});

app.get('/dashboard/data', (req,res)=>{
    res.sendFile(path.join(__dirname, './views/data.html'));
});

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => 
    console.log('connected to DB')
);

//listening to the server
app.listen(3000);