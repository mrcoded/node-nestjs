const db = require("../db/db")

async function countPostsByUser(column, order = "ASC") {
  const countPostsByUserQuery = `
  SELECT users.username, COUNT(posts.id) as post_count
  FROM users
  LEFT JOIN posts ON users.id = posts.user_id
  GROUP BY users.id, users.username
  ORDER BY ${column} ${order}
  `

  try {
    const res = await db.query(countPostsByUserQuery)
    return res.rows
  } catch (error) {
    console.error("Error", error);
  }
}

async function avgPostsPerUser() {
  const avgPostsPerUserQuery = `
  SELECT AVG(post_count) as average_posts
  FROM(
  SELECT COUNT(posts.id) as post_count
  FROM users
  LEFT JOIN posts ON users.id = posts.user_id
  GROUP BY users.id
) as user_per_counts
  `

  try {
    const res = await db.query(avgPostsPerUserQuery)
    return res.rows
  } catch (error) {
    console.error("Error", error);
  }
}

module.exports = { countPostsByUser, avgPostsPerUser }