require('dotenv').config()
const express = require('express')
const authorRoutes = require("./routes/authorRoutes")
const bookRoutes = require("./routes/bookRoutes")
const promClient = require('prom-client')

const app = express()
app.use(express.json())

const register = new promClient.Registry()
promClient.collectDefaultMetrics({ register })

//check how many http req
const httpRequestsCounter = new promClient.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"]
})

register.registerMetric(httpRequestsCounter)

//middleware to track API requests
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestsCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode
    })
  })

  next()
})

//Expose the metrics endpoint for prometheus
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType)
  res.send(await register.metrics())
})

// api routes
app.use("/api/author", authorRoutes)
app.use("/api/book", bookRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})