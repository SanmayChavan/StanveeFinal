// // utils/sendEmail.js
// import nodemailer from "nodemailer";

// export const sendEmail = async ({ to, subject, html }) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS, // Gmail App Password
//       },
//     });

//     const mailOptions = {
//       from: `"My E-commerce Shop" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,

//       // ✅ HTML EMAIL
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height:1.6;">
//           ${html}
//         </div>
//       `,

//       // ✅ TEXT FALLBACK (VERY IMPORTANT)
//       text: "Thank you for your order. Please view this email in HTML format to see full details.",
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log(`📧 Email sent to ${to} | ID: ${info.messageId}`);
//   } catch (error) {
//     console.error("❌ Email send failed:", error.message);
//   }
// };



import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    const info = await transporter.sendMail({
      from: `"My E-commerce Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          ${html}
        </div>
      `,
      text: "Thank you for your order.",
    });

    console.log(`📧 Email sent to ${to} | ID: ${info.messageId}`);
    return info;

  } catch (error) {
    console.error("❌ Email send failed:");
    console.error(error);
    throw error; // IMPORTANT
  }
};
