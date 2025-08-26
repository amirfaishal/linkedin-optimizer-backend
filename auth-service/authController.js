const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");

// ================== REGISTER ==================
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // 1. Check if user exists
    const existing = await pool.query(
      "SELECT * FROM usertable WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Generate next user ID
    const idResult = await pool.query(
      "SELECT COALESCE(MAX(CAST(SUBSTRING(u_id, 4) AS INTEGER)), 0) + 1 AS next_id FROM usertable"
    );
    const nextId = idResult.rows[0].next_id;
    const uId = `USR${nextId.toString().padStart(4, "0")}`;
    const createDate = new Date().toISOString().split("T")[0];

    // 4. Insert into usertable
    const roleValue = role?.toLowerCase() === "user" ? "U" : "O";
    const newUser = await pool.query(
      `INSERT INTO usertable (u_id, username, email, password, role, create_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [uId, username, email, hashedPassword, roleValue, createDate]
    );

    // 5. Create credit entry
    try {
      await pool.query(
        `INSERT INTO credittable (uid, token_value) VALUES ($1, 0)`,
        [uId]
      );
    } catch (creditErr) {
      console.error("Credit insert error:", creditErr.message, { uId });
      return res.status(500).json({ message: "Failed to create credit entry", detail: creditErr.message });
    }

    // 6. Generate JWT with u_id
    const token = jwt.sign({ u_id: newUser.rows[0].u_id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 7. Response
    res.status(201).json({
      user: {
        username: newUser.rows[0].username,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role === "O" ? "organization" : "user",
        u_id: newUser.rows[0].u_id,
      },
      token,
    });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// ================== LOGIN ==================
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const userQuery = await pool.query(
      "SELECT * FROM usertable WHERE email = $1",
      [email]
    );

    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = userQuery.rows[0];

    // 2. Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT using u_id (not SERIAL id)
    const token = jwt.sign({ u_id: user.u_id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 4. Response
    res.json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role === "O" ? "organization" : "user",
        u_id: user.u_id,
      },
      token,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// ================== LOGOUT ==================
const logoutUser = async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser };
