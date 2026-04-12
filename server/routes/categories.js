import express from "express";
import pool from "../config/db.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ===============================
// GET ALL CATEGORIES
// ===============================
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id,
        title,
        description,
        parent_id,
        CASE 
          WHEN main_image IS NOT NULL 
          THEN CONCAT('/uploads/', main_image)
          ELSE NULL
        END AS main_image
      FROM categories
      ORDER BY id ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// ADD CATEGORY
// ===============================
router.post(
  "/",
  upload.single("main_image"),
  async (req, res) => {
    try {
      const { title, description, parent_id } = req.body;

      let parentId = parent_id === "" ? null : Number(parent_id);

      const mainImage = req.file ? req.file.filename : null;

      const result = await pool.query(
        `INSERT INTO categories (title, description, parent_id, main_image)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [title, description, parentId, mainImage]
      );

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ===============================
// UPDATE CATEGORY
// ===============================
router.put(
  "/:id",
  upload.single("main_image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, parent_id } = req.body;

      let parentId = parent_id === "" ? null : Number(parent_id);

      const mainImage = req.file ? req.file.filename : null;

      const result = await pool.query(
        `UPDATE categories SET 
          title=$1,
          description=$2,
          parent_id=$3,
          main_image=COALESCE($4, main_image)
        WHERE id=$5 RETURNING *`,
        [title, description, parentId, mainImage, id]
      );

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ===============================
// DELETE CATEGORY
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM categories WHERE id=$1", [id]);

    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;