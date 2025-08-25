const { Pool } = require("pg");

const pool = new Pool({
  ssl: {
    rejectUnauthorized: false, // Required by Render’s Postgres
  },
});

module.exports = pool;
