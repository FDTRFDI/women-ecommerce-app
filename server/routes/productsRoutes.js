import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/* =========================
   GET ALL PRODUCTS (PUBLIC)
========================= */

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.price,
        CONCAT('/uploads/', p.image) AS image,
        (
          SELECT json_agg(color)
          FROM product_colors
          WHERE product_id = p.id
        ) AS colors,
        (
          SELECT CONCAT('/uploads/', pi.image_url)
          FROM product_images pi
          WHERE pi.product_id = p.id
          ORDER BY pi.id ASC
          LIMIT 1
        ) AS gallery_image
      FROM products p
      ORDER BY p.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching products" });
  }
});

/* =========================
   GET SINGLE PRODUCT + DETAILS
========================= */

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await pool.query(
      `
      SELECT 
        id,
        name,
        price,
        description,
        CONCAT('/uploads/', image) AS image
      FROM products
      WHERE id=$1
    `,
      [id]
    );

    if (product.rows.length === 0)
      return res.status(404).json({ message: "Product not found" });

    const p = product.rows[0];

    // GALLERY IMAGES
    const images = await pool.query(
      "SELECT CONCAT('/uploads/', image_url) AS image FROM product_images WHERE product_id=$1",
      [id]
    );

    // COLORS ONLY
    const colors = await pool.query(
      "SELECT color FROM product_colors WHERE product_id=$1",
      [id]
    );

    res.json({
      ...p,
      images: images.rows.map((i) => i.image),
      colors: colors.rows.map((c) => c.color),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching product details" });
  }
});

/* =========================
   DELETE PRODUCT
========================= */

router.delete("/:id", async (req, res) => {
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
    console.error(err);
    res.status(500).json({ message: "Error deleting product" });
  }
});

export default router;