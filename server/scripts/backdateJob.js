const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const connectDB = async () => {
    try {
        // Use job_tracker_db to match server.js default
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/job_tracker_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const ageJob = async (days) => {
    await connectDB();
    try {
        // Find ghost user
        const user = await User.findOne({ email: 'ghost@test.com' });
        if (!user) {
            console.log('User ghost@test.com not found. Cannot assign job.');
            return;
        }
        console.log(`Using user: ${user.email} (${user.username})`);

        // Find any job belonging to this user or create one
        let job = await Job.findOne({ user: user._id });
        if (!job) {
            console.log('No jobs found for user. Creating one...');
            job = await Job.create({
                company: 'Ghost Corp',
                position: 'Phantom Dev',
                status: 'Applied',
                user: user._id,
            });
        }

        if (job) {
            const oldDate = new Date();
            oldDate.setDate(oldDate.getDate() - days);

            // Bypass timestamps to force old updatedAt and ensure status is Applied
            await Job.updateOne(
                { _id: job._id },
                {
                    $set: {
                        updatedAt: oldDate,
                        status: 'Applied'
                    }
                },
                { timestamps: false }
            );
            console.log(`Updated job ${job.company} to be 'Applied' and ${days} days old.`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
};

const days = process.argv[2] ? parseInt(process.argv[2]) : 20;
ageJob(days);
