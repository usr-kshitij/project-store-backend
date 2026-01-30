const express = require("express");
const auth = require("../middleware/authMiddleware");
const db = require("../db");

const router = express.Router();

router.get("/", auth, (req, res) => {
  db.query(
    "SELECT id, name, email FROM users WHERE id = ?",
    [req.user.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
});

module.exports = router;

