const hashService = require("../bcrypt/hashService");

const normalizeUser = async (user) => {
  const hashedPassword = await hashService.generateHash(user.password);
  return {
    ...user,
    password: hashedPassword,
    isAdmin: false,
    isOwner: false,
    license: {
      filename: user.license.filename || null,
      path: user.license.path || null,
      contentType: user.license.contentType || null,
    },
  };
};

module.exports = normalizeUser;
