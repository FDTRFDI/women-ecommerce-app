import express from "express";
import pool from "../config/db.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// UPLOAD SETTINGS
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/* =========================
   ADD PRODUCT
========================= */
router.post(
  "/products",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const { name, price, description, category } = req.body;

      const mainImage = req.files.image ? req.files.image[0].filename : null;

      const result = await pool.query(
        `INSERT INTO products (name, price, description, category, image)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [name, price, description, category, mainImage]
      );

      const productId = result.rows[0].id;

      // GALLERY IMAGES
      if (req.files.images) {
        for (let img of req.files.images) {
          await pool.query(
            "INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)",
            [productId, img.filename]
          );
        }
      }

      // COLORS
      if (req.body.colors) {
        const colors = JSON.parse(req.body.colors);
        for (let c of colors) {
          await pool.query(
            "INSERT INTO product_colors (product_id, color) VALUES ($1, $2)",
            [productId, c]
          );
        }
      }

      res.json({ message: "Product added successfully" });

    } catch (err) {
      console.error("ADD PRODUCT ERROR:", err);
      res.status(500).json({ message: "Error saving product" });
    }
  }
);

/* =========================
   DELETE PRODUCT
========================= */
router.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Delete gallery images
    await pool.query("DELETE FROM product_images WHERE product_id=$1", [id]);

    // Delete colors
    await pool.query("DELETE FROM product_colors WHERE product_id=$1", [id]);

    // Delete main product
    await pool.query("DELETE FROM products WHERE id=$1", [id]);

    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
});

export default router;