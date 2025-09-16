import { Task } from "../types";
import type { Context } from "hono";
import { Database } from "bun:sqlite";

export async function createTask(c: Context, db: Database) {
  const userId = c.get("jwtPayload").userId;
  const userRole = c.get("jwtPayload").role;
  const { title, description, user_id } = await c.req.json();

  //if userid not found
  // if (!userId) {
  //   return c.json({ error: "Unauthenticated!" }, 401);
  // }

  //if user role is not admin
  if (userRole !== "admin") {
    return c.json({ error: "You are not authorized to create tasks" }, 403);
  }

  if (userId === user_id) {
    return c.json({ error: "Invalid user! unauthorized to create tasks" }, 403);
  }

  try {
    const result = db
      .query(
        `
      INSERT INTO tasks (user_id, title, description) VALUES (?,?,?)
      RETURNING *
      `
      )
      .get(user_id, title, description) as Task;

    return c.json(result, 201);
  } catch (error) {
    console.error("Error", error);
    return c.json({ error: "Error creating task" }, 500);
  }
}

export async function updateTask(c: Context, db: Database) {
  const taskId = c.req.param("id");
  const userId = c.get("jwtPayload").userId;
  const userRole = c.get("jwtPayload").role;
  const { title, description, user_id } = await c.req.json();

  // if userid not found
  if (!userId) {
    return c.json({ error: "Unauthenticated!" }, 401);
  }

  //if user role is not admin
  if (userRole !== "admin") {
    return c.json({ error: "You are not authorized to update this task" }, 403);
  }

  if (userId !== user_id) {
    return c.json(
      { error: "Invalid user! unauthorized to update this task" },
      403
    );
  }

  try {
    const extractedTask = db
      .query(` SELECT * FROM tasks WHERE id = ? `)
      .get(taskId) as Task | undefined;

    //if task not found
    if (!extractedTask) {
      return c.json({ error: "Task not found" }, 404);
    }

    const updatedTask = db
      .query(
        `
      UPDATE tasks
      SET title = ?, description = ?, user_id = ?
      WHERE id = ?
      RETURNING *
      `
      )
      .get(
        title || extractedTask.title,
        description !== "" ? description : extractedTask.description,
        user_id || extractedTask.user_id,
        taskId
      ) as Task;

    return c.json(updatedTask, 201);
  } catch (error) {
    console.error("Error", error);
    return c.json({ error: "Error updating task" }, 500);
  }
}

export async function getAllTasks(c: Context, db: Database) {
  try {
    const alltasks = db.query("SELECT * FROM tasks").all() as Task[];
    return c.json(alltasks, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Error getting tasks" }, 500);
  }
}

export async function getTask(c: Context, db: Database) {
  const taskId = c.req.param("id");
  try {
    const task = db.query("SELECT * FROM tasks WHERE id = ?").get(taskId) as
      | Task
      | undefined;

    //if task not found
    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    return c.json(task, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Error getting tasks" }, 500);
  }
}

export async function deleteTask(c: Context, db: Database) {
  const taskId = c.req.param("id");
  const userId = c.get("jwtPayload").userId;
  const userRole = c.get("jwtPayload").role;
  const { user_id } = await c.req.json();

  // if userid not found
  if (!userId) {
    return c.json({ error: "Unauthenticated!" }, 401);
  }

  //if user role is not admin
  if (userRole !== "admin") {
    return c.json({ error: "You are not authorized to update this task" }, 403);
  }

  if (userId !== user_id) {
    return c.json(
      { error: "Invalid user! unauthorized to update this task" },
      403
    );
  }

  try {
    const deletedTask = db.query("DELETE FROM tasks WHERE id = ?").run(taskId);

    //if task not found
    if (!deletedTask || deletedTask.changes === 0) {
      return c.json({ error: "Task not found" }, 404);
    }

    return c.json({ message: "Task deleted successfully" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Error getting tasks" }, 500);
  }
}
