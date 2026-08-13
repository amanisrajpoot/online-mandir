const BASE_URL = "https://vandanam.online";

// Reusable Base Template structure for consistent branding
function BaseEmailTemplate(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vandanam Online</title>
      <style>
        body {
          font-family: 'Georgia', serif;
          background-color: #fffaf0;
          margin: 0;
          padding: 30px 0;
          color: #431407;
        }
        .container {
          max-width: 650px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          border: 1px solid #fcd34d;
          box-shadow: 0 15px 35px rgba(234, 88, 12, 0.15);
          overflow: hidden;
        }
        .header-bg {
          position: relative;
          text-align: center;
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          padding: 40px 20px;
          border-bottom: 4px solid #ea580c;
        }
        .om-symbol {
          height: 80px;
          margin-bottom: 20px;
        }
        .logo {
          height: 50px;
        }
        .content {
          padding: 50px 40px;
          line-height: 1.8;
          font-size: 16px;
        }
        .content h1 {
          color: #9a3412;
          font-size: 26px;
          margin-top: 0;
          font-weight: normal;
          text-align: center;
        }
        .content p {
          color: #572c1c;
          text-align: center;
        }
        .diya-divider {
          text-align: center;
          margin: 40px 0;
        }
        .diya-divider img {
          max-width: 250px;
          height: auto;
        }
        .order-box {
          background-color: #fffbeb;
          border: 1px dashed #f59e0b;
          border-radius: 12px;
          padding: 25px;
          margin: 30px 0;
          text-align: center;
        }
        .order-box p {
          margin: 10px 0;
          font-size: 16px;
          color: #78350f;
        }
        .btn {
          display: inline-block;
          background-color: #ea580c;
          color: #ffffff !important;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 50px;
          font-weight: bold;
          font-family: 'Segoe UI', sans-serif;
          margin-top: 20px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(234, 88, 12, 0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .footer {
          text-align: center;
          background-color: #9a3412;
          color: #fef3c7;
          font-size: 14px;
          padding: 40px 20px;
          font-family: 'Segoe UI', sans-serif;
        }
        .footer p {
          margin: 10px 0;
        }
        .footer-shloka {
          font-size: 18px;
          font-style: italic;
          color: #fde68a;
          margin-bottom: 20px;
          font-family: 'Georgia', serif;
        }
        .video-box {
          text-align: center;
          background-color: #ecfdf5;
          border: 1px dashed #10b981;
          border-radius: 12px;
          padding: 30px 20px;
          margin: 40px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        
        <!-- Sacred Header -->
        <div class="header-bg">
          <img src="${BASE_URL}/email-assets/om-symbol.png" alt="Om" class="om-symbol" /><br/>
          <img src="${BASE_URL}/email-assets/logo.png" alt="Vandanam" class="logo" />
        </div>
        
        <!-- Main Content -->
        <div class="content">
          ${content}
        </div>
        
        <!-- Sacred Footer -->
        <div class="footer">
          <div class="footer-shloka">
            "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्।"
          </div>
          <p>May the divine blessings of the Almighty always be with you.</p>
          <p><strong>Har Har Mahadev</strong></p>
          <p style="opacity: 0.7; font-size: 12px; margin-top: 20px;">&copy; ${new Date().getFullYear()} Vandanam Spiritual Services.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 1. Order Success Template
export function OrderSuccessTemplate(
  customerName: string, 
  orderId: string, 
  amount: number,
  serviceName: string
) {
  const content = `
    <h1>Namaste ${customerName || 'Devotee'},</h1>
    <p>Your divine offering and booking have been successfully received.</p>
    
    <div class="diya-divider">
      <img src="${BASE_URL}/email-assets/diya-divider.png" alt="Diya" />
    </div>
    
    <div class="order-box">
      <p><strong>Booking Reference:</strong> #${orderId.split('-')[0]}</p>
      <p><strong>Sacred Service:</strong> ${serviceName}</p>
      <p><strong>Dakshina / Amount:</strong> ₹${amount}</p>
    </div>

    <p>The temple priests will begin the sacred preparations for your rituals shortly. We will keep you updated as your spiritual journey progresses.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${BASE_URL}/profile" class="btn">View Your Journey</a>
    </div>
  `;
  
  return BaseEmailTemplate(content);
}

// 2. Status Update Template
export function StatusUpdateTemplate(
  customerName: string,
  orderId: string,
  newStatus: string,
  videoUrl?: string
) {
  let title = "Divine Update on your Booking";
  let message = "";

  if (newStatus === "in_progress") {
    title = "Your Rituals Have Commenced 🙏";
    message = "The temple priests have begun the sacred mantras and rituals for your booking. May your prayers be answered.";
  } else if (newStatus === "video_uploaded") {
    title = "Your Sankalp Darshan is Ready! 🌺";
    message = "The Panditji has successfully performed your rituals. A personalized recording of your Sankalp and Darshan has been uploaded.";
  } else if (newStatus === "prasad_shipped") {
    title = "Prasad Journey Begins 📦";
    message = "Your divine Prasad, blessed at the temple, has been carefully packed and shipped. It is on its way to your home.";
  } else if (newStatus === "completed") {
    title = "Rituals Successfully Completed 🕉️";
    message = "Your booked spiritual service has been successfully and purely fulfilled. May you and your family be blessed with peace, health, and prosperity.";
  }

  const content = `
    <h1>Namaste ${customerName || 'Devotee'},</h1>
    <p style="font-size: 18px; color: #ea580c; font-weight: bold; margin-top: 20px;">${title}</p>
    <p>${message}</p>
    
    <div class="diya-divider">
      <img src="${BASE_URL}/email-assets/diya-divider.png" alt="Diya" />
    </div>

    ${videoUrl ? `
      <div class="video-box">
        <h3 style="color: #047857; margin-top: 0; font-family: 'Georgia', serif; font-size: 22px;">Watch Your Sacred Sankalp</h3>
        <p style="font-size: 15px; margin-bottom: 25px; color: #064e3b;">Click below to view the recording of the rituals performed on your behalf.</p>
        <a href="${videoUrl}" class="btn" style="background-color: #10b981; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">▶ Watch Darshan</a>
      </div>
    ` : ''}

    <p style="font-size: 14px; color: #a16207; margin-top: 30px;">Booking Reference: #${orderId.split('-')[0]}</p>
  `;

  return BaseEmailTemplate(content);
}
