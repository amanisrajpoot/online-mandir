import nodemailer from 'nodemailer';

// Helper to send Email via SMTP
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  // Use the custom SMTP settings from environment variables
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn("Email not sent: SMTP credentials not configured in environment variables.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465', 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Vandanam Online" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    
    console.log(`Email successfully sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Helper to send SMS via Fast2SMS
export async function sendSMS({
  phone,
  message,
}: {
  phone: string;
  message: string;
}) {
  if (!process.env.FAST2SMS_API_KEY) {
    console.warn("SMS not sent: FAST2SMS_API_KEY not configured.");
    return false;
  }

  try {
    // Fast2SMS expects 10-digit mobile number
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        route: "q", // q is for quick transactional route
        message: message,
        numbers: cleanPhone
      })
    });

    const data = await response.json();
    
    if (data.return) {
      console.log(`SMS successfully sent to ${cleanPhone}`);
      return true;
    } else {
      console.error("Fast2SMS API Error:", data);
      return false;
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
}

// Order Confirmation Triggers
export async function notifyOrderSuccess(orderId: string, customerDetails: any, amount: number) {
  const { customer_name, customer_phone, customer_email } = customerDetails;
  
  // 1. Send SMS (Super Critical)
  if (customer_phone) {
    const smsMessage = `Namaste ${customer_name || 'Devotee'}, your booking (ID: ${orderId.split('-')[0]}) of Rs${amount} is confirmed. We will notify you once the rituals begin. - Vandanam`;
    // We don't await SMS so it runs in background and doesn't block the API
    sendSMS({ phone: customer_phone, message: smsMessage });
  }

  // 2. Send Email (Receipt/Details)
  if (customer_email) {
    const emailSubject = `Order Confirmed: Vandanam Spiritual Services (#${orderId.split('-')[0]})`;
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f97316;">Namaste ${customer_name || 'Devotee'},</h2>
        <p>Your payment of <strong>₹${amount}</strong> was successful and your order is confirmed.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p>We will keep you updated on the progress of your rituals. You can check your dashboard on vandanam.online for live updates.</p>
        <br/>
        <p>Har Har Mahadev,<br/>The Vandanam Team</p>
      </div>
    `;
    
    sendEmail({ to: customer_email, subject: emailSubject, html: emailHtml });
  }
}
