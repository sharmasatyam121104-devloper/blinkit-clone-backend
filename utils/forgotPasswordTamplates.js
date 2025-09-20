

const forgotPasswordTemplate = ({ name, otp }) => {
  return `
  <div style="margin:0; padding:0; background:#f7f9fc; color:#1a1a1a; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; line-height:1.6;">
    <div style="max-width:600px; margin:32px auto; background:#ffffff; border-radius:14px; padding:32px; box-shadow:0 6px 24px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="text-align:center; padding-bottom:18px; border-bottom:1px solid #edf2f7;">
        <h2 style="color:#2c3e50; margin:0; font-size:24px; letter-spacing:-0.2px;">🔐 Password Reset Request</h2>
      </div>

      <!-- Greeting -->
      <p style="margin:18px 0 10px; font-size:16px; color:#374151;">
        Hi <strong>${name}</strong>,
      </p>

      <!-- Main Message -->
      <p style="margin:0 0 16px; font-size:15px; color:#4b5563;">
        We received a request to reset the password for your <strong>Satyam Store</strong> account. Please use the OTP below to continue. This code will expire in <b>60 minutes</b>.
      </p>

      <!-- OTP Box -->
      <div style="text-align:center; margin:24px 0;">
        <p style="margin:0 0 10px; font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:0.6px; font-weight:600;">
          Verification Code
        </p>
        <div style="display:inline-block; background:#ffffff; border:2px dashed #d1d5db; border-radius:10px; padding:14px 20px; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <span style="font-family:'Courier New',Courier,monospace; font-size:30px; font-weight:800; letter-spacing:8px; color:#1f2937;">
            ${otp}
          </span>
        </div>
        <div style="margin-top:10px;">
          <span style="display:inline-block; background:#fff7ed; color:#7c2d12; font-size:12px; padding:4px 8px; border-radius:6px;">
            ⏰ Expires in 60 minutes
          </span>
        </div>
      </div>

      <!-- Note -->
      <p style="font-size:14px; color:#4b5563; margin:16px 0; background:#f9fafb; border-left:4px solid #e5e7eb; padding:12px 12px; border-radius:0 8px 8px 0;">
        If you did not request this password reset, please ignore this email. Your account will remain safe and secure.
      </p>

      <!-- Footer -->
      <div style="margin-top:26px; border-top:1px solid #edf2f7; padding-top:14px; text-align:center;">
        <p style="font-size:12px; color:#9ca3af; margin:0;">
          © ${new Date().getFullYear()} Satyam Store. All rights reserved.
        </p>
      </div>
    </div>

    <!-- Mobile tweaks -->
    <style>
      @media screen and (max-width:640px) {
        h2 { font-size:22px !important; }
        .otp { font-size:26px !important; letter-spacing:6px !important; }
        div[style*="max-width:600px"] { margin:16px auto !important; padding:24px !important; border-radius:12px !important; }
      }
    </style>
  </div>
  `;
};

export default forgotPasswordTemplate;
