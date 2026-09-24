require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Generic function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Leader" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Registration email
async function sendRegisterationEmail(userEmail, name) {
  const subject = "Welcome to Backend Leader!";

  const text = `Hello ${name},

Thank you for registering at Backend Leader.`;

  const html = `
    <p>Hello ${name},</p>
    <p>Thank you for registering at Backend Leader.</p>
  `;

  await sendEmail(userEmail, subject, text, html);
}

// Export everything
module.exports = {
  sendEmail,
  transporter,
  sendRegisterationEmail,
};