// Email templates

const templates = {
  verificationOTP: (name, otp) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', sans-serif; background: #f0f4f8; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 40px; text-align: center; }
        .content { padding: 40px; }
        .otp-box { background: #f0f4f8; border-left: 4px solid #6366f1; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .otp-code { font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; color: #6366f1; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">AcadWatch</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Email Verification</p>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Welcome to AcadWatch! Your one-time password for account verification is:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code expires in <strong>10 minutes</strong>. Do not share this code with anyone.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The AcadWatch Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 AcadWatch. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  highRiskAlert: (studentName, score, reasons) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', sans-serif; background: #f0f4f8; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .alert-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 15px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">⚠️ High Risk Alert</h1>
        </div>
        <div class="content">
          <p>Student <strong>${studentName}</strong> has been flagged as <strong>High Risk</strong>.</p>
          <div class="alert-box">
            <p style="margin: 0;"><strong>Current Risk Score: ${score}/100</strong></p>
            <p style="margin: 5px 0 0 0; color: #7f1d1d;">Requires immediate attention</p>
          </div>
          <p><strong>Top Reasons for Risk:</strong></p>
          <ul>
            ${reasons.map(r => `<li>${r}</li>`).join('')}
          </ul>
          <p style="color: #6b7280; font-size: 14px;">Please log in to AcadWatch and take immediate action to support this student.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  interventionLogged: (studentName, type, remarks) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', sans-serif; background: #f0f4f8; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .detail-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">✓ Intervention Logged</h1>
        </div>
        <div class="content">
          <p>Dear ${studentName},</p>
          <p>An intervention has been logged for you by your academic mentor.</p>
          <div class="detail-box">
            <p style="margin: 0;"><strong>Type:</strong> ${type}</p>
            <p style="margin: 5px 0 0 0;"><strong>Details:</strong> ${remarks}</p>
          </div>
          <p>Please follow up with your mentor or coordinator for more information and support.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

module.exports = templates;
