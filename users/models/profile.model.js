const conn = require("../../utils/database.config");

exports.createProfile = (profileData) => {
  console.log(profileData);
  const insertProfileSql = `INSERT INTO user_profile VALUES (?, ?, ?, ?, ?, NOW())`;
  return conn
    .promise()
    .query(insertProfileSql, [
      profileData._id,
      profileData.fname,
      profileData.lname,
      profileData.gender,
      profileData.inschool,
    ]);
};

exports.updateProfile = (profileData) => {
  const updateProfileSql = `UPDATE user_profile
    SET
        up_fname=?,
        up_lname=?,
        up_gender=?,
        up_inschool=?
    WHERE
        user_id=?
    `;
  return conn
    .promise()
    .query(updateProfileSql, [
      profileData.fname,
      profileData.lname,
      profileData.gender,
      profileData.inschool,
      profileData._id,
    ]);
};

exports.queryProfileWithId = (profileUserId) => {
  const queryProfileSql = `SELECT up_fname, up_lname, up_gender, up_inschool, up_created_date 
    FROM user_profile WHERE user_id='${profileUserId}'`;
  return conn.promise().query(queryProfileSql);
};

exports.queryProfileInfoWithId = (profileUserId) => {
  const queryProfileSql = `SELECT up_fname, up_lname FROM user_profile WHERE user_id='${profileUserId}'`;
  return conn.promise().query(queryProfileSql);
};
