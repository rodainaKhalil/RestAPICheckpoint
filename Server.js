const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const { error } = require('console');
const path = require('path');

const envPath = path.join(__dirname, 'config', '.env');

dotenv.config({ path: envPath });
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
dotenv.config();

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//ROUTES

// Index
app.get('/', (req, res) => {
    res.send('Hello NODE API')
});

// GET: Return all users
app.get('/AllUsers', async(req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch(error) {
        res.status(500).json({message: error.message})
    }
});

// POST: Add a new user to the database
app.post('/AddUser', async(req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(200).json(user);
    } catch(error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
});

// PUT: Edit a user by ID
app.put('/UpdateUser/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);

        //We cannot find any product with that id in database
        if(!user) {
            return res.status(404).json({message: 'Cannot find any user with this ID' })
        }
        const updatedUser = await User.findById(id);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// DELETE: Remove a user by ID
app.delete('/DeleteUser/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({message: 'Cannot find any user with this ID'})
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
