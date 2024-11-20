const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://atlantis-voyages.com', 
    methods: ['GET', 'POST']
}));
app.use(express.urlencoded({ extended: true }));
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your SMTP server address
    port: 465,               // Replace with the port (587 is common for TLS)
    secure: true,   
    auth: {
        user: process.env.EMAIL_USER, // Replace with your email address
        pass: process.env.EMAIL_PASS  // Replace with your email password or app-specific password
    }
});
// Landing page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit-form', (req, res) => {
    const { email } = req.body;

    // Define the email options
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Replace with your email address
        to: 'inbox.tunisiatrip@gmail.com',  // Destination email address
        subject: 'New Subscription from Atlantis Voyages',
        text: `New subscriber: ${email}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent: ' + info.response);
        res.redirect('/');
    });
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
