const { Pool } = require("pg");

const pool = new Pool({
  ssl: {
    rejectUnauthorized: false, // required for Render PostgreSQL
  },
});

module.exports = pool;
