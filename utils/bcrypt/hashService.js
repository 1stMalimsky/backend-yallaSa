const bcryptjs = require("./bcrypt");

const generateHash = async (password) => {
  console.log("password created:", await bcryptjs.encryptPassword(password));

  return await bcryptjs.encryptPassword(password);
};

const compareHash = async (password, hash) => {
  return await bcryptjs.compareHash(password, hash);
};

module.exports = {
  generateHash,
  compareHash,
};
