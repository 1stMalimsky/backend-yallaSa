const hashService = require("../bcrypt/hashService");

const normalizeUser = async (user) => {
  const hashedPassword = await hashService.generateHash(user.password);
  return {
    ...user,
    password: hashedPassword,
    isAdmin: false,
    isOwner: false,
  };
};

module.exports = normalizeUser;
