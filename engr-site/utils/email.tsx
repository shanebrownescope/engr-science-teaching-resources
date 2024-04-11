// utils/email.js
import nodemailer from 'nodemailer';


 // Create a Nodemailer transporter
 export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});




/**  
Based on the search results, here are the key points on how to use Nodemailer to send emails from Outlook (or Outlook.com/Hotmail):
SMTP Server Configuration:
To send emails using Outlook/Hotmail, you need to configure the Nodemailer transporter to use the Outlook SMTP server.
The SMTP server details for Outlook/Hotmail are:
Host: smtp.office365.com
Port: 587
Secure: false (use tls instead)
Authentication:
For authentication, you need to use your Outlook/Hotmail email address and password.
If you have enabled two-factor authentication (2FA) on your Outlook account, you'll need to generate an app password instead of using your regular password.
Here's an example of how to set up the Nodemailer transporter to use Outlook/Hotmail:
javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'your-outlook-email@outlook.com',
    pass: 'your-outlook-password-or-app-password'
  }
});

const mailOptions = {
  from: 'your-outlook-email@outlook.com',
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'This is a test email sent using Nodemailer and Outlook.'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error occurred:', error.message);
    return;
  }
  console.log('Message sent:', info.messageId);
});

Here are a few additional points:
If you have enabled two-factor authentication (2FA) on your Outlook account, you'll need to generate an app password and use that instead of your regular password.
Make sure to replace 'your-outlook-email@outlook.com' and 'your-outlook-password-or-app-password' with your actual Outlook email address and password/app password.
The secure: false and tls settings are necessary because Outlook/Hotmail uses a different security configuration compared to Gmail.
By following this example and configuring the Nodemailer transporter with the correct Outlook SMTP server details and authentication, you should be able to send emails from your Outlook account using Nodemailer in your Node.js application.
*/