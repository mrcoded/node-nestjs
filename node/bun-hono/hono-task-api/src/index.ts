import { z } from "zod";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { initDatabase } from "./db/db";
import { zValidator } from "@hono/zod-validator";
import { loginUser, registerUser } from "./controllers/auth";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
} from "./controllers/task";

const app = new Hono();
const db = initDatabase();

app.use("*", cors());
app.use("*", logger());

const auth = jwt({
  secret: process.env.JWT_SECRET_KEY || "secret",
});

//input validation
const registerSchema = z.object({
  username: z.string().min(3).max(25),
  password: z.string().min(6),
  role: z.enum(["admin", "user"]).optional(),
  created_at: z.date().optional(),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
});

const taskSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().optional(),
  user_id: z.number().int().positive(),
});

//***auth routes***
//register user
app.post("/register", zValidator("json", registerSchema), (c) =>
  registerUser(c, db)
);
//login
app.post("/login", zValidator("json", loginSchema), (c) => loginUser(c, db));

//task routes
app.post("/create-task", auth, zValidator("json", taskSchema), (c) =>
  createTask(c, db)
);
//get all tasks
app.get("/tasks", auth, (c) => getAllTasks(c, db));
//get task
app.get("/task/:id", auth, (c) => getTask(c, db));
//update task
app.patch("/task/:id", auth, zValidator("json", taskSchema), (c) =>
  updateTask(c, db)
);
//delete task
app.delete("/task/:id", auth, (c) => deleteTask(c, db));

app.get("/", (c) => {
  return c.text("Hello, User and Task management using Bun & Hono!");
});

app.get("/db-test", (c) => {
  const result = db.query("SELECT sqlite_version()").get();

  return c.json({
    message: "Database connection successful",
    sqlite_version: result,
  });
});

export default app;
