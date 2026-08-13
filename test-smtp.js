const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function test() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Vandanam Online" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: 'test@example.com',
      subject: 'SMTP Test',
      html: '<b>Test</b>',
    });
    console.log('Success:', info.messageId);
  } catch (error) {
    console.error('SMTP Error:', error);
  }
}
test();
