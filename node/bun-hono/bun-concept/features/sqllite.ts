import { Database } from "bun:sqlite";

async function sqlliteDemo() {
  const db = new Database("bundb.sqlite");

  //create a table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, 
    age INTEGER,
    email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  );
  console.log("Table USERS created successfully");

  const insertUser = db.prepare(`
    INSERT INTO users (name, age, email) VALUES (?, ?, ?)
  `);
  //   insertUser.run("Ade Ola", 20, "libraade@gmail.com");
  //   insertUser.run("Code Lord", 10, "codedlord@gmail.com");
  //   insertUser.run("Don Raphy", 200, "donraphy@gmail.com");

  // const allUsers = db.prepare("SELECT * FROM users");
  // const users = allUsers.all();
  // console.log(users);

  //update user by ID
  // db.run(`UPDATE users SET age = ? WHERE id = ?`, [30, 1]);

  // const getUpdatedUser = db.query(`SELECT * FROM users WHERE id = ?`).get(1);
  // console.log(getUpdatedUser);

  //delete
  db.run(`DELETE FROM users WHERE id = ?`, [1]);
  const deletedUser = db.query(`SELECT * FROM users WHERE id = ?`).get(1);
  const remainingUsers = db.query(`SELECT * FROM users`).all();

  console.log(deletedUser, remainingUsers);
}

sqlliteDemo();
