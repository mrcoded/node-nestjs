import express, { Express, Request, Response, NextFunction } from "express";
import { IUser, User } from "./models/User.model";

const app: Express = express();
const port = 3000;

// req=> Request types consist of
//req.params = :id,
// res.body = res.json, res.send
// req.body, req.query, locals

app.use(express.json());

interface CustomRequest extends Request {
  startTime?: number;
}

//middleware
app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Typescript with express");
});

interface User {
  name: string;
  age: number;
}

app.post("/user", (req: Request<{}, {}, User>, res: Response) => {
  const { name, age } = req.body;
  res.json({
    message: `Name: ${name}, Age: ${age}`,
  });
});

app.get("/users", async (req: Request<{}, {}, User>, res: Response) => {
  try {
    const users: IUser[] = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get("/user/:id", (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  res.json({
    userId: id,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
