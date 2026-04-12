import db from "../config/db.js";

// =======================
// GET ALL PRODUCTS
// =======================
export const getAllProducts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        id,
        title,
        price,
        description,
        CASE 
          WHEN main_image IS NOT NULL 
          THEN '/uploads/' || TRIM(BOTH '/' FROM main_image)
          ELSE NULL
        END AS main_image,
        (
          SELECT ARRAY_AGG(
            CASE 
              WHEN g IS NOT NULL 
              THEN '/uploads/' || TRIM(BOTH '/' FROM g)
              ELSE NULL
            END
          )
          FROM unnest(gallery) AS g
        ) AS gallery,
        colors,
        category_id
      FROM category_products
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// GET PRODUCTS BY CATEGORY
// =======================
export const getCategoryProducts = async (req, res) => {
  const categoryId = Number(req.params.categoryId);

  try {
    const subCats = await db.query(
      `SELECT id FROM categories WHERE parent_id = $1`,
      [categoryId]
    );

    const subIds = subCats.rows.map((c) => c.id);
    const ids = [categoryId, ...subIds];

    const result = await db.query(
      `SELECT 
        id,
        title,
        price,
        description,
        CASE 
          WHEN main_image IS NOT NULL 
          THEN '/uploads/' || TRIM(BOTH '/' FROM main_image)
          ELSE NULL
        END AS main_image,
        (
          SELECT ARRAY_AGG(
            CASE 
              WHEN g IS NOT NULL 
              THEN '/uploads/' || TRIM(BOTH '/' FROM g)
              ELSE NULL
            END
          )
          FROM unnest(gallery) AS g
        ) AS gallery,
        colors,
        category_id
      FROM category_products
      WHERE category_id = ANY($1::int[])
      ORDER BY id DESC`,
      [ids]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// GET SINGLE PRODUCT
// =======================
export const getSingleCategoryProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { rows } = await db.query(
      `SELECT 
        id,
        title,
        price,
        description,
        CASE 
          WHEN main_image IS NOT NULL 
          THEN '/uploads/' || TRIM(BOTH '/' FROM main_image)
          ELSE NULL
        END AS main_image,
        (
          SELECT ARRAY_AGG(
            CASE 
              WHEN g IS NOT NULL 
              THEN '/uploads/' || TRIM(BOTH '/' FROM g)
              ELSE NULL
            END
          )
          FROM unnest(gallery) AS g
        ) AS gallery,
        colors,
        category_id
      FROM category_products
      WHERE id = $1
      LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =======================
// ADD PRODUCT
// =======================
// =======================
// ADD PRODUCT
// =======================
export const addCategoryProduct = async (req, res) => {
  try {
    const { title, price, description, category_id } = req.body;

    const categoryId = Number(category_id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const mainImage = req.files?.main_image
      ? req.files.main_image[0].filename
      : null;

    const gallery = req.files?.gallery
      ? req.files.gallery.map((f) => f.filename)
      : [];

    const colors = req.body.colors
      ? Array.isArray(req.body.colors)
        ? req.body.colors
        : [req.body.colors]
      : [];

    const result = await db.query(
      `INSERT INTO category_products 
       (title, price, description, main_image, gallery, colors, category_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, price, description, mainImage, gallery, colors, categoryId]
    );

    const row = result.rows[0];

    // 👇 أهم جزء — نرجّع نفس شكل SELECT
    res.json({
      ...row,
      main_image: row.main_image
        ? "/uploads/" + row.main_image
        : null,
      gallery: row.gallery
        ? row.gallery.map((g) => "/uploads/" + g)
        : []
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// =======================
// UPDATE PRODUCT
// =======================
// =======================
// UPDATE PRODUCT
// =======================
export const updateCategoryProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const { title, price, description } = req.body;

    const mainImage = req.files?.main_image
      ? req.files.main_image[0].filename
      : null;

    const gallery = req.files?.gallery
      ? req.files.gallery.map((f) => f.filename)
      : [];

    const colors = req.body.colors
      ? Array.isArray(req.body.colors)
        ? req.body.colors
        : [req.body.colors]
      : [];

    const result = await db.query(
      `UPDATE category_products
       SET title=$1,
           price=$2,
           description=$3,
           main_image=COALESCE($4, main_image),
           gallery=CASE WHEN $5::text[] <> '{}' THEN $5 ELSE gallery END,
           colors=$6
       WHERE id=$7 RETURNING *`,
      [title, price, description, mainImage, gallery, colors, id]
    );

    const row = result.rows[0];

    // 👇 أهم جزء — نرجّع نفس شكل SELECT
    res.json({
      ...row,
      main_image: row.main_image
        ? "/uploads/" + row.main_image
        : null,
      gallery: row.gallery
        ? row.gallery.map((g) => "/uploads/" + g)
        : []
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// =======================
// DELETE PRODUCT
// =======================
export const deleteCategoryProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    await db.query("DELETE FROM category_products WHERE id=$1", [id]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};