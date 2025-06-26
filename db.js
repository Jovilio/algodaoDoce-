// db.js
const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",       // << coloque seu usuário MySQL
  password: "_dev",     // << coloque sua senha MySQL
  database: "impressoras_db",
});

module.exports = db;
