import nodemailer from 'nodemailer';
import { OrderSuccessTemplate, StatusUpdateTemplate } from './email-templates';

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
  
  // 1. Send SMS (Only if amount > 51)
  if (customer_phone && amount > 51) {
    const smsMessage = `Namaste ${customer_name || 'Devotee'}, your booking (ID: ${orderId.split('-')[0]}) of Rs${amount} is confirmed. We will notify you once the rituals begin. - Vandanam`;
    sendSMS({ phone: customer_phone, message: smsMessage });
  }

  // 2. Send Email (Receipt/Details) using HTML Template
  if (customer_email) {
    const emailSubject = `Order Confirmed: Vandanam Spiritual Services (#${orderId.split('-')[0]})`;
    const emailHtml = OrderSuccessTemplate(
      customer_name,
      orderId,
      amount,
      "Vandanam Spiritual Service"
    );
    
    sendEmail({ to: customer_email, subject: emailSubject, html: emailHtml });
  }
}

// Order Status Update Triggers
export async function notifyOrderStatusUpdate(
  orderId: string, 
  customerDetails: any, 
  newStatus: string, 
  videoUrl?: string
) {
  const { customer_name, customer_phone, customer_email } = customerDetails;
  
  // 1. Send SMS (Only for Critical event: Completed)
  if (customer_phone && newStatus === 'completed') {
    const smsMessage = `Namaste ${customer_name || 'Devotee'}, your booked service (ID: ${orderId.split('-')[0]}) is now completed. May you be blessed with peace and prosperity. - Vandanam`;
    sendSMS({ phone: customer_phone, message: smsMessage });
  }

  // 2. Send Email (Detailed Status) using HTML Template
  if (customer_email) {
    const emailSubject = `Booking Update: Status is now ${newStatus.replace('_', ' ')} (#${orderId.split('-')[0]})`;
    const emailHtml = StatusUpdateTemplate(
      customer_name,
      orderId,
      newStatus,
      videoUrl
    );
    
    sendEmail({ to: customer_email, subject: emailSubject, html: emailHtml });
  }
}
