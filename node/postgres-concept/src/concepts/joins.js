const db = require("../db/db")

//inner join retuns a row where there is a match in both tables

async function getUsersWithPosts() {
  const getUserWithPostsQuery = `
  SELECT users.id, users.username, posts.title
  FROM users
  INNER JOIN posts ON users.id = posts.user_id
  `

  try {
    const res = await db.query(getUserWithPostsQuery)
    return res.rows
  } catch (error) {
    console.error(error);
  }
}

async function getAllUsersAndTheirPosts() {
  const getUsersAndTheirPostsQuery = `
  SELECT users.id, users.username, posts.title
  FROM users
  LEFT JOIN posts ON users.id = posts.user_id
  `

  try {
    const res = await db.query(getUsersAndTheirPostsQuery)
    return res.rows
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getUsersWithPosts, getAllUsersAndTheirPosts }