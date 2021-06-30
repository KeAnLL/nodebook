const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "nodebook",
});

connection.connect((err) => {
  if (err) {
    console.error(err.message);
  }
  console.info("Database connected!");
});

module.exports = connection;
