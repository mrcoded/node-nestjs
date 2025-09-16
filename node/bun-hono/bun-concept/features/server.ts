import type { Server } from "bun";

interface User {
  id: number;
  name: string;
}

interface ApiResponse {
  method: string;
  route: string;
  message: string;
  data?: User | User[];
}

const users: User[] = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Bob" },
  { id: 4, name: "Alice" },
  { id: 5, name: "Charlie" },
];

const server: Server = Bun.serve({
  port: 8000,
  fetch(request: Request, server): Response {
    const url = new URL(request.url);
    const method = request.method;

    let response: ApiResponse = {
      method: method,
      route: url.pathname,
      message: "Hello from BunJS",
    };

    if (url.pathname === "/") {
      // root route
      if (method === "GET") {
        response.message = "Welcome to Bun API";
      } else {
        response.message = "method not allowed";
      }
    } else if (url.pathname === "/users") {
      switch (method) {
        case "GET":
          response.message = "List of users";
          response.data = users;

          break;
        case "POST":
          response.message = "Creating list of users";

          break;

        default:
          response.message = "method not allowed";
          break;
      }
    }

    return Response.json(response);
  },
});

console.log(`Server running on http://localhost:${server.port}`);
