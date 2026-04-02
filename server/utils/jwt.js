const jwt = require("jsonwebtoken");

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture || "",
    },
    process.env.JWT_SECRET || "dev-secret",
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );
}

module.exports = { signToken };
