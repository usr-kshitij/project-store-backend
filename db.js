const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // default empty on macOS Homebrew
  database: "project_store"
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err);
  } else {
    console.log("✅ MySQL connected successfully");
  }
});

module.exports = db;

