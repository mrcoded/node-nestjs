import { Database } from "bun:sqlite";

export function initDatabase(): Database {
  const db = new Database("bun_hono_task_crud.sqlite");

  //users table
  db.run(`
      CREATE TABLE IF NOT EXISTS users (
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'user')) NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

  //tasks table
  db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
      )
  `);

  return db;
}
