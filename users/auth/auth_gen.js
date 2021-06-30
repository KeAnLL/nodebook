const jwt = require("jsonwebtoken");

exports.generateTokenInCookie = (res, user_id) => {
  // const expiration = 86400000; // 1 day
  const expiration = 30 * 60; // 30min
  const token = jwt.sign({ _id: user_id }, process.env.TOKEN_SECRET, {
    expiresIn: "30m",
  });
  return res.cookie("token", token, {
    expires: new Date(Date.now() + expiration),
    secure: false, // true if using HTTPS
    httpOnly: true,
  });
};

exports.generateAccessToken = (user_id) => {
  const expiration = 30 * 60; // 30min
  return jwt.sign({ _id: user_id }, process.env.TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

exports.generateRefreshToken = (user_id) => {
  return jwt.sign({ _id: user_id }, process.env.REFRESH_TOKEN);
};
