const nodemailer = require("nodemailer");

// =====================================
// Email Transporter
// =====================================

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// =====================================
// Send OTP by Email
// =====================================

exports.sendEmailOTP = async (email, otp, type = "reset") => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error(
      "Email service is not configured"
    );
  }

  const isRegistration = type === "registration";
  const subject = isRegistration
    ? "SilkVerse Account Verification OTP"
    : "SilkVerse Password Reset OTP";
  const heading = isRegistration
    ? "Welcome to SilkVerse"
    : "SilkVerse Password Reset";
  const description = isRegistration
    ? "Thank you for signing up for SilkVerse! Please verify your email address with the OTP below."
    : "We received a request to reset your SilkVerse account password.";
  const note = isRegistration
    ? "If you did not sign up for SilkVerse, please ignore this email."
    : "If you did not request a password reset, you can safely ignore this email.";

  await emailTransporter.sendMail({
    from:
      process.env.SMTP_FROM ||
      process.env.SMTP_USER,

    to: email,

    subject,

    text: `Your SilkVerse OTP is ${otp}. This OTP will expire in 10 minutes. ${note}`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #7A1F2B; margin-top: 0;">
          ${heading}
        </h2>

        <p style="color: #444; font-size: 15px;">
          ${description}
        </p>

        <p style="color: #666; font-size: 14px;">
          Your One-Time Password (OTP) is:
        </p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          padding: 15px;
          background: #fdf5f5;
          color: #7A1F2B;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        ">
          ${otp}
        </div>

        <p style="color: #666; font-size: 13px;">
          This OTP will expire in <strong>10 minutes</strong>.
        </p>

        <p style="color: #888; font-size: 12px;">
          ${note}
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />

        <p style="color: #7A1F2B; font-size: 13px; margin: 0;">
          Regards,<br />
          <strong>SilkVerse Team</strong>
        </p>
      </div>
    `,
  });
};

// =====================================
// Send OTP by Mobile - MSG91
// =====================================

exports.sendMobileOTP = async (mobile, otp) => {
  if (!process.env.MSG91_AUTH_KEY) {
    throw new Error(
      "MSG91 service is not configured"
    );
  }

  if (!process.env.MSG91_TEMPLATE_ID) {
    throw new Error(
      "MSG91 template ID is not configured"
    );
  }

  const response = await fetch(
    "https://control.msg91.com/api/v5/otp",
    {
      method: "POST",

      headers: {
        authkey: process.env.MSG91_AUTH_KEY,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        template_id:
          process.env.MSG91_TEMPLATE_ID,

        mobile: `91${mobile}`,

        otp,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Failed to send mobile OTP"
    );
  }

  if (
    data?.type &&
    data.type.toLowerCase() === "error"
  ) {
    throw new Error(
      data.message ||
        "Failed to send mobile OTP"
    );
  }

  return data;
};