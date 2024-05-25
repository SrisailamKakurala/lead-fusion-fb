const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const profileRoutes = require('./routes/profileRoutes');
const otpRoutes = require('./routes/otpRoutes');
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsAllowInvalidCertificates: true, // Only use this for testing purposes, not in production
})

app.use('/api/profile', profileRoutes);
app.use('/api/otp', otpRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
