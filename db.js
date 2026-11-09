const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Gagal terhubung ke database Neon:', err.message);
  } else {
    console.log('Berhasil terhubung ke database PostgreSQL di Neon!');
    release();
  }
});

module.exports = pool;