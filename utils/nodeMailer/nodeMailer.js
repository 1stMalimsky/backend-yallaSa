const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "alonmalichi@gmail.com", // Use environment variables in production!
    pass: "flbqinggxjyczmbb",
  },
});

/**
 * Sends an email dynamically based on the type.
 * @param {string} recipientEmail - The recipient's email.
 * @param {string} subject - The email subject.
 * @param {string} template - The email template with placeholders.
 * @param {object} replacements - Object containing replacement values.
 * @returns {Promise<void>}
 */
const sendEmail = async (recipientEmail, subject, template, replacements) => {
  try {
    let htmlMessage = template;
    Object.keys(replacements).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      htmlMessage = htmlMessage.replace(regex, replacements[key]);
    });

    const info = await transporter.sendMail({
      from: `"יאללה סע!" <alonmalichi@gmail.com>`,
      to: recipientEmail,
      subject: subject,
      html: htmlMessage,
    });

    console.log(`✅ Email sent to ${recipientEmail}: ${info.messageId}`);
  } catch (err) {
    console.error("❌ sendEmail Error:", err);
  }
};

module.exports = { sendEmail };
