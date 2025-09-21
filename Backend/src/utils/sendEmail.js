import nodemailer from "nodemailer";

console.log('FROM_EMAIL in sendEmail.js:', process.env.FROM_EMAIL);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email Sent Successfully`);
  } catch (error) {
    console.error(`Error sending email: `, error);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;
