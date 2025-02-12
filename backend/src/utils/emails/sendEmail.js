import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, template) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.VITE_GMAIL_EMAIL,
      pass: process.env.VITE_GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.VITE_GMAIL_EMAIL,
    to: email,
    subject: subject,
    html: template,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).send(error);
    res.status(200).send("Email sent successfully");
  });
};
