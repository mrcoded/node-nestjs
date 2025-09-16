import { sign } from "hono/jwt";
import { User } from "../types";
import type { Context } from "hono";
import { Database } from "bun:sqlite";
import { password as bunPassword } from "bun";

export async function registerUser(c: Context, db: Database) {
  const { username, password, role = "user" } = await c.req.json();

  if (!username || !password) {
    return c.json({ error: "username and password are required" }, 400);
  }

  if (role !== "admin" && role !== "user") {
    return c.json({ error: "Invalid role" }, 400);
  }

  try {
    const existingUser = db
      .query("SELECT * FROM users WHERE username = ?")
      .get(username) as User | undefined;

    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    //hash password
    const hashedPassword = await bunPassword.hash(password);
    //insert user into database
    db.run(
      `
      INSERT INTO users (username, password, role) VALUES (?, ?, ?)
    `,
      [username, hashedPassword, role]
    );

    return c.json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
}

export async function loginUser(c: Context, db: Database) {
  const { username, password } = await c.req.json();

  if (!username || !password) {
    return c.json({ error: "username and password are required" }, 400);
  }

  try {
    const user = db
      .query("SELECT * FROM users WHERE username = ?")
      .get(username) as User | undefined;

    //check if user exists
    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    //check if password is correct
    const isPasswordValid = await bunPassword.verify(password, user.password);
    if (!isPasswordValid) {
      return c.json({ error: "Invalid password" }, 401);
    }
    //create token
    const token = await sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY || "secret"
    );

    return c.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
}
