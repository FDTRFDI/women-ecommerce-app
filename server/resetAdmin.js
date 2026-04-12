import bcrypt from "bcryptjs";
import pool from "./config/db.js";

const reset = async () => {
  try {
    const password = "123456";

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users
       SET password = $1,
           role = 'admin'
       WHERE email = 'admin@omnera.com'`,
      [hash]
    );

    console.log("Admin password reset successfully");
    console.log("email: admin@omnera.com");
    console.log("password: 123456");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

reset();