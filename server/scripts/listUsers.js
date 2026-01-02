const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/job-tracker', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const listUsers = async () => {
    await connectDB();
    try {
        const users = await User.find({});
        console.log('Users found:', users.map(u => u.email));
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

listUsers();
