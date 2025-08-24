// utils/emailService.js

import { createTransport } from 'nodemailer';

/**
 * Sends an email via Gmail SMTP.
 * @param {Object} params
 * @param {string} params.to - Recipient's email address
 * @param {string} params.subject - Email subject
 * @param {string} params.html - HTML content
 * @param {string} [params.text] - Optional plain text fallback
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `SwasthaMann <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('📨 Email sent successfully');
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    throw new Error('Email delivery failed');
  }
};

export default sendEmail;
