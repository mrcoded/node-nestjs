require("dotenv").config();
const express = require("express");
const corsConfig = require("./config/corsConfig")
const { urlVersioning } = require("./middleware/apiVersioning");
const createBasicRateLimiter = require("./middleware/rateLimiting");
const { globalErrorHandler } = require("./middleware/errorHandler");
const { addTimestamp, requestLogger } = require("./middleware/customMiddleware");

//routes
const itemRoutes = require("./routes/items-routes");

// const cors
const app = express();
const port = 3000;

//express json middleware
app.use(requestLogger);
app.use(addTimestamp);

app.use(corsConfig());
app.use(createBasicRateLimiter(100, 15 * 60 * 1000));
app.use(express.json());

app.use(urlVersioning("v1"));
app.use("/api/v1", itemRoutes);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
