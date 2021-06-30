const crypto = require("crypto");

exports.userFieldChk = (data) => {
  if (data.password && data.email) {
    return true;
  }
  return false;
};

exports.defaultMailNameGen = (email) => {
  return email.split("@")[0];
};

exports._pwdGen = (rawPwd, salt) => {
  if (!salt) {
    salt = crypto.randomBytes(16).toString("base64");
  }
  let hash = crypto.createHmac("sha512", salt).update(rawPwd).digest("base64");

  return [salt, hash];
};

exports._emailChk = (rawEmail) => {
  var patt =
    /^[a-zA-z0-9!#$%&*+/=?^_`{|}~-]{1}[a-zA-z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gm;
  return rawEmail.match(patt);
};
