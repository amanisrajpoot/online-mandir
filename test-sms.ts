import { config } from 'dotenv'

config({ path: '.env.local' })

async function sendSMS({
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
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    
    console.log("Sending SMS to", cleanPhone);
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": process.env.FAST2SMS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: "Booking Confirmed",
        numbers: cleanPhone
      })
    });

    const data = await response.json();
    console.log("Response:", data);
    
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
}

sendSMS({ phone: "9876543210", message: "Namaste Devotee, your booking of Rs 100 is confirmed. - Vandanam" })
