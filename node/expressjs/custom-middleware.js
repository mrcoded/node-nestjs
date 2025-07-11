const express = require('express');
const app = express();

const requestTimestamp = (req, res, next) => {
  const timeStamp = new Date().toString()

  console.log(`${timeStamp} from ${req.method} to ${req.url}`);
  next()

}

app.use(requestTimestamp)

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
