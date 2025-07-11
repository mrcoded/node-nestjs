const express = require('express');
const app = express();

//define middleware fn
const myFirstMiddleware = (req, res, next) => {
  console.log("this first middleware function will run on every request");

  next() //if you want function to be invoked each time
}

app.use(myFirstMiddleware)

app.get('/', (req, res) => {
  res.send("Welcome to my Homepage")
})

app.get('/about', (req, res) => {
  res.send("About Page")
})

const port = 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
