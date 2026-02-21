import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
configDotenv();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Error setting up email transporter:", error);
  } else {
    console.log("Email transporter is ready to send messages");
  }
});

export default transporter;

//  function to send email
export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.log("Error sending email: ", error);
  }
};

export async function SendRegisterationEmail(userEmail, name) {
  const verifyUrl = `${process.env.APP_URL || "https://yourapp.example.com"}/verify?email=${encodeURIComponent(
    userEmail,
  )}`;

  const subject = "Welcome to Our Banking App — Verify your email";

  const text = `Hello ${name},

Welcome to The Banking App! Please verify your email address to activate your account and secure your banking activities.

Verify your account: ${verifyUrl}

If you didn't sign up for this account, you can safely ignore this email.

Need help? Reply to this email or contact ${process.env.SUPPORT_EMAIL || "support@yourapp.example.com"}.

Best regards,
The Banking App Team
`;

  const html = `
  <html>
  <body style="font-family:Arial,Helvetica,sans-serif;background-color:#f6f9fc;margin:0;padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;margin:24px;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:20px 24px;background:#0d6efd;color:#ffffff;text-align:left;">
                <h2 style="margin:0;font-size:20px;">The Banking App</h2>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;color:#0f172a;">
                <p style="font-size:16px;margin:0 0 12px;">Hi ${name},</p>
                <p style="margin:0 0 16px;">Thanks for creating an account with The Banking App. To get started and secure your account, please verify your email address by clicking the button below.</p>

                <p style="text-align:center;margin:24px 0;">
                  <a href="${verifyUrl}" style="background:#0d6efd;color:#ffffff;padding:12px 22px;border-radius:6px;text-decoration:none;display:inline-block;">Verify your email</a>
                </p>

                <p style="font-size:13px;color:#475569;margin:0 0 12px;">If the button doesn't work, copy and paste the following link into your browser:</p>
                <p style="word-break:break-all;color:#0d6efd;font-size:13px;margin:0 0 12px;">${verifyUrl}</p>

                <hr style="border:none;border-top:1px solid #eef2f7;margin:20px 0;" />

                <p style="font-size:13px;color:#64748b;margin:0;">Need help? Contact <a href="mailto:${process.env.SUPPORT_EMAIL || "support@yourapp.example.com"}" style="color:#0d6efd;text-decoration:none;">${process.env.SUPPORT_EMAIL || "support@yourapp.example.com"}</a></p>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 24px;background:#f1f5f9;color:#94a3b8;font-size:12px;text-align:center;">
                © ${new Date().getFullYear()} The Banking App. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  await sendEmail(userEmail, subject, text, html);
}
