const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {  
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// send conf. email
const sendConfirmationEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Email Confirmation',
    text: `Please confirm your registration by clicking on the following link: 
    http://localhost:3000/api/user/verify/${token}`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending confirmation email');
  }
};


module.exports = { sendConfirmationEmail };