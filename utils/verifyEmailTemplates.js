const verifyEmailTemplates = ({name, url}) => {
  
  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      
      <h2 style="color: #2c3e50; text-align: center;">Welcome to Satyam Store 🎉</h2>
      
      <p>Dear <strong>${name}</strong>,</p>
      <p>Thank you for registering with <strong>Satyam Store</strong>. We’re excited to have you on board!  
      To complete your registration, please verify your email address by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" target="_blank" 
          style="background: #4CAF50; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block;">
          ✅ Verify Email
        </a>
      </div>
      
      <p>If the button above doesn’t work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #2980b9;">${url}</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 12px; color: #777; text-align: center;">
        If you did not sign up for Satyam Store, please ignore this email.
      </p>
    </div>
  </div>
  `;
};

export default verifyEmailTemplates;
