const express = require("express");
const auth = require("../middleware/authMiddleware");
const db = require("../db");

const router = express.Router();

/* CHECK & GET DOWNLOAD */
router.get("/download/:projectId", auth, (req, res) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;

  // Check payment
  db.query(
    "SELECT * FROM payments WHERE user_id = ? AND project_id = ? AND status = 'success'",
    [userId, projectId],
    (err, payments) => {
      if (err) return res.status(500).json(err);

      if (payments.length === 0) {
        return res.status(403).json({ msg: "Purchase required" });
      }

      // Get project download link
      db.query(
        "SELECT download_url FROM projects WHERE id = ?",
        [projectId],
        (err, result) => {
          if (err) return res.status(500).json(err);
          res.json({ downloadUrl: result[0].download_url });
        }
      );
    }
  );
});

module.exports = router;
