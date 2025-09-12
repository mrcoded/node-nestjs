const db = require("../db/db")

async function createUserTable() {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )
  `
  try {
    await db.query(createTableQuery)
    console.log("Users table created successfully");
  } catch (error) {
    console.log("Failed to create users table", error);
  }
}

async function insertUser(username, email) {
  // VALUES($1, $2) - two placeholders prevent SQL injection
  //returns the newly created values
  const insertUserQuery = `
  INSERT INTO users (username,email)
  VALUES ($1, $2)
  RETURNING *
  `

  try {
    const res = await db.query(insertUserQuery, [username, email])
    console.log("User inserted successfully", res.rows[0]);

    return res.rows[0]
  } catch (error) {
    console.log("Failed to create user", error);
  }
}

async function fetchAllUsers() {
  const getAllUsersFromTable = ` SELECT * FROM users`

  try {
    const res = await db.query(getAllUsersFromTable)
    console.log("All Users fetched successfully", res.rows);

    return res.rows
  } catch (error) {
    console.log("Failed to create user", error);
  }
}

async function updateUserInfo(username, newEmail) {
  const updateUserQuery = ` 
  UPDATE users
  SET email = $2
  WHERE username = $1
  RETURNING *
  `

  try {
    const res = await db.query(updateUserQuery, [username, newEmail])

    if (res.rows.length > 0) {
      console.log("User updated successfully", res.rows[0]);
      return res.rows[0]
    } else {
      console.log("Username not found");
      return null
    }

  } catch (error) {
    console.log("Failed to create user", error);
  }
}
async function updateUserInfo(username, newEmail) {
  const updateUserQuery = ` 
  UPDATE users
  SET email = $2
  WHERE username = $1
  RETURNING *
  `

  try {
    const res = await db.query(updateUserQuery, [username, newEmail])

    if (res.rows.length > 0) {
      console.log("User updated successfully", res.rows[0]);
      return res.rows[0]
    } else {
      console.log("Username not found");
      return null
    }

  } catch (error) {
    console.log("Failed to create user", error);
  }
}

async function deleteInfo(username) {
  const deleteQuery = ` 
  DELETE FROM users
  WHERE username = $1
  RETURNING *
  `

  try {
    const res = await db.query(deleteQuery, [username])

    if (res.rows.length > 0) {
      console.log("User deleted successfully", res.rows[0]);
      return res.rows[0]
    } else {
      console.log("Username not found");
      return null
    }

  } catch (error) {
    console.log("Failed to create user", error);
  }
}

module.exports = {
  createUserTable,
  insertUser,
  fetchAllUsers,
  updateUserInfo,
  deleteInfo
}