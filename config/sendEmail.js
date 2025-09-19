import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // .env file load karne ke liye

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail ke liye
  auth: {
    user: process.env.EMAIL_USER, // tera Gmail address
    pass: process.env.EMAIL_PASS  // Gmail App Password (normal password nahi chalega)
  }
});

// Email send karne ka function
const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Satyam Store" <${process.env.EMAIL_USER}>`, // sender ka naam + email
      to: sendTo,    // recipient email
      subject,      // email ka subject
      html          // email ka content (HTML)
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email send failed:", error);
    return null;
  }
};

export default sendEmail;
