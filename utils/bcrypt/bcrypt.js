const bcryptjs = require("bcryptjs");

const encryptPassword = async (password) => await bcryptjs.hash(password, 10);

const compareHash = async (password, hash) =>
  await bcryptjs.compare(password, hash);

module.exports = {
  encryptPassword,
  compareHash,
};
