require("dotenv").config();

module.exports = {
  secret: process.env.SECRET_CODE,
  jwtExpiration: 3600, // 1 hour
  jwtRefreshExpiration: 86400, // 24 hours
};
