const cors = require("cors");

const corsConfig = () => {
  return cors({
    //origin => this will tell that which origins you want user can access your api
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "https://localhost.com", //production domain
      ];

      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); //given permission to allow request
      } else {
        callback(new Error("Cors not allowed!"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Version"],
    exposedHeaders: ["X-Total-Count", "Content-Range"],
    preflightContinue: false,
    maxAge: 600, //cache for 10 mins avoid sending options req multiple times
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 204,
  });
};

module.exports = corsConfig 
