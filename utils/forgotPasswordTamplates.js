const forgotPasswordTemplate = ({ name, otp }) => {
  return `
  <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; padding: 0; background-color: #f4f6f8; margin: 0;">
    <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 6px 20px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
        <h2 style="color: #2c3e50; margin: 0; font-size: 26px;">🔐 Password Reset Request</h2>
      </div>
      
      <!-- Greeting -->
      <p style="margin-top: 20px; font-size: 16px; color: #444;">Hi <strong>${name}</strong>,</p>
      
      <!-- Main Message -->
      <p style="font-size: 15px; color: #555;">
        We received a request to reset the password for your <strong>Satyam Store</strong> account.  
        Please use the OTP below to continue. This code will expire in <b>10 minutes</b>.
      </p>
      
      <!-- OTP Box -->
      <div style="text-align: center; margin: 30px 0;">
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; background: linear-gradient(135deg, #4CAF50, #2ecc71); color: #fff; display: inline-block; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          ${otp}
        </div>
      </div>
      
      <!-- Note -->
      <p style="font-size: 14px; color: #666; margin-top: 20px;">
        If you did not request this password reset, please ignore this email.  
        Your account will remain safe and secure.
      </p>
      
      <!-- Footer -->
      <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; text-align: center;">
        <p style="font-size: 12px; color: #999; margin: 0;">
          © ${new Date().getFullYear()} Satyam Store. All rights reserved.
        </p>
      </div>
    </div>
  </div>
  `;
};

export default forgotPasswordTemplate;
