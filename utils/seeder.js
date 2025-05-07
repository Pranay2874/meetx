const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Activity = require('../models/Activity');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample activity data
const activities = [
  {
    title: 'Cricket Match: India vs Australia',
    description: 'Watch the exciting cricket match between India and Australia at the national stadium.',
    location: 'National Cricket Stadium',
    dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    capacity: 100,
    price: 1500,
    category: 'sports'
  },
  {
    title: 'Avengers: Final Chapter - Movie Screening',
    description: 'Special screening of the latest Avengers movie with exclusive behind-the-scenes footage.',
    location: 'PVR Cinemas',
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    capacity: 200,
    price: 350,
    category: 'movies'
  },
  {
    title: 'Football Tournament Finals',
    description: 'The final match of the city football tournament. Come cheer for your favorite team!',
    location: 'Central Sports Arena',
    dateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    capacity: 150,
    price: 800,
    category: 'sports'
  },
  {
    title: 'Jazz Night',
    description: 'An evening of smooth jazz music featuring renowned local artists.',
    location: 'Blue Note Jazz Club',
    dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    capacity: 75,
    price: 1200,
    category: 'concerts'
  },
  {
    title: 'Coding Bootcamp Workshop',
    description: 'Intensive one-day coding bootcamp covering the latest web development technologies.',
    location: 'Tech Hub',
    dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    capacity: 30,
    price: 2500,
    category: 'workshops'
  }
];

// Import data into DB
const importData = async () => {
  try {
    await Activity.deleteMany();
    await Activity.insertMany(activities);
    
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Activity.deleteMany();
    
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Handle command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please add proper command: -i (import) or -d (delete)');
  process.exit();
}