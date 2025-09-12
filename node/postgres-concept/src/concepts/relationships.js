const db = require("../db/db")

async function createPostsTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS posts(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `

  try {
    await db.query(createTableQuery)
    console.log("Posts created sucesfully!");

  } catch (error) {
    console.error("Error", error);

  }
}

async function insertNewPost(title, content, userId) {
  const insertPostQuery = `
    INSERT INTO posts (title, content, user_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `

  try {
    const res = await db.query(insertPostQuery, [title, content, userId])

    return res.rows[0]
  } catch (error) {
    console.error("Error", error);

  }
}

module.exports = { createPostsTable, insertNewPost }