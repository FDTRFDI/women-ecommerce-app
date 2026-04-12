import bcrypt from "bcryptjs";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "omnera",
  password: "YOUR_DB_PASSWORD",
  port: 5432,
});

const create = async () => {

  const password = "123456";

  const hash = await bcrypt.hash(password, 10);

  await pool.query(`
    UPDATE users
    SET password = $1,
        role = 'admin'
    WHERE email = '123456'
  `, [hash]);

  console.log("ADMIN PASSWORD UPDATED");
  console.log("email: admin@omnera.com");
  console.log("password:", password);

  process.exit();
};

create();