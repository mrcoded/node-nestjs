require("dotenv").config()
const http = require('http');
const socket = require('socket.io');
const express = require('express');
const connectToDB = require('./lib/db')
const authRoutes = require('./node-auth/routes/auth-routes')
const homeRoutes = require('./node-auth/routes/home-routes')
const adminRoutes = require('./node-auth/routes/admin-routes')
const uploadRoutes = require('./node-auth/routes/image-routes')
const productRoutes = require('./mongoDB-intermediate/routes/product-routes')
const bookRoutes = require('./mongoDB-intermediate/routes/book-routes')
// const bookRoutes = require('./bookstoreAPI/routes/books.routes')

const app = express();
// const port = process.env.PORT || 3000

//create http server
const server = http.createServer(app)
//create socket
const io = socket(server)

//connect to database
connectToDB()

//middleware
app.use(express.static("public"))

// ***********NODEJS-SOCKET*************
//socket connection
const users = new Set()

io.on("connection", (socket) => {
  console.log("A user connected");

  //handle user join chat
  socket.on("join", (username) => {
    users.add(username)
    socket.userName = username

    //broadcast all users that new user has joined
    io.emit("userJoined", username)

    //send updated user list
    io.emit("userList", [...users])
  })

  //handle incoming message
  socket.on("chatMessage", (message) => {
    io.emit("chatMessage", message)
  })

  //handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");

    users.forEach((username) => {
      if (username === socket.userName) {
        users.delete(username)

        io.emit("userLeft", username)

        //send updated user list
        io.emit("userList", [...users])
      }
    })
  })
})



//middleware => express.json
app.use(express.json())

//routes here
// app.use("/api/books", bookRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/", homeRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/images", uploadRoutes)
app.use("/products", productRoutes)
app.use("/reference", bookRoutes)

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`)
// })
// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`)
// })