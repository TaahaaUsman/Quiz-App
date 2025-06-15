import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 8px; background: #f9f9f9; color: #333;">
      <h2 style="color: #4F46E5;">Verify Your Email</h2>
      <p>Hi there,</p>
      <p>Use the following OTP to verify your email:</p>
      <div style="font-size: 24px; font-weight: bold; margin: 16px 0; color: #10B981;">
        ${otp}
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p style="margin-top: 24px;">Cheers,<br/><strong>VU_LMS Team</strong></p>
    </div>`,
    });
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw new Error("Email sending failed");
  }
};
