const fs = require("fs");
const path = require("path");

/**
 * Loads an email template from the `emailTemplates` folder.
 * @param {string} templateName - The name of the template file (e.g., "reservationConfirmation").
 * @returns {string} - The email template content as a string.
 */
const loadEmailTemplate = (templateName) => {
  const templatePath = path.join(
    __dirname,
    "./emailTemplates",
    `${templateName}.html`
  );

  try {
    return fs.readFileSync(templatePath, "utf8");
  } catch (error) {
    console.error(`❌ Error loading email template: ${templateName}`, error);
    return "";
  }
};

module.exports = loadEmailTemplate;
