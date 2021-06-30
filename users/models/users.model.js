const conn = require("../../utils/database.config");

exports.createUser = (userData) => {
  const insertUserSql = `
    INSERT INTO 
      user (user_name, user_email, user_pwd, user_salt, user_role) 
    VALUES 
      ('${userData.username}', '${userData.email}', '${userData.password[1]}', '${userData.password[0]}', 1)`;
  return conn.promise().query(insertUserSql);
};

exports.updateUser = (userParams) => {
  const updateUserSql = `UPDATE user SET user_name='${userParams.username}' AND user_pwd='${userParams.password}'`;
  return conn.promise().query(updateUserSql);
};

exports.queryUserById = (userId) => {
  const queryIdSql = `SELECT user_name FROM user WHERE user_id='${userId}'`;
  conn.promise().query(queryIdSql);
};

exports.queryUserByUsername = (username) => {
  const queryNameSql = `SELECT user_id FROM user WHERE user_name='${username}'`;
  return conn.promise().query(queryNameSql);
};

exports.queryUserByEmail = (userEmail) => {
  const queryEmailSql = `SELECT user_id FROM user WHERE user_email='${userEmail}'`;
  return conn.promise().query(queryEmailSql);
};

exports.queryUserExist = (userData) => {
  const queryExistSql = `SELECT COUNT(*) AS count, user_salt AS s FROM user WHERE user_name='${userData.username}'`;
  return conn.promise().query(queryExistSql);
};

exports.queryMatch = (userData) => {
  const queryMatchSql = `SELECT COUNT(*) AS count, user_id AS "_id" FROM user WHERE user_name='${userData.username}' AND user_pwd='${userData.password}' AND user_salt='${userData.s}'`;
  return conn.promise().query(queryMatchSql);
};
