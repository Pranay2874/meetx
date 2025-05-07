const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();         
connectDB();             

const app = express();
const activityRoutes = require('./routes/activityRoutes');

app.use(express.json()); 
app.use('/api/activities', activityRoutes);
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use(express.static('public'));


app.use('/api/auth', require('./routes/authRoutes'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
