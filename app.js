import express, { json, urlencoded } from "express";
import cors from "cors";
import morgan from "morgan";
import createError from "http-errors";
import sequelize from "./src/configs/database.js";
import cookies from "cookie-parser";
import {} from "dotenv/config";

import httpresponse from "./src/helpers/http_response.js";

import api from "./src/middlewares/routers/api.js";

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = !process.env.HOST ? "localhost" : process.env.HOST;
const ISDEV = !process.env.NODE_ENV ? false : process.env.NODE_ENV.trim() === "development" ? true : false;

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(cookies());
app.use(morgan("short"));
app.use(express.static("public"));

/** routers */
app.use("/api", api);

/** 404 */
app.use("/", (req, res, next) => {
  next(createError(404, "NOT_FOUND", { message: "Page not found" }));
});

/** error handler */
app.use((err, req, res, next) => {
  ISDEV ? console.log(err) : "";
  res.status(err.status || 500).json(httpresponse(err.status || 500, err.message, { errors: err.errors }));
});

/** start server */
app
  .listen(PORT, HOST, async () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
    try {
      await sequelize.authenticate();
      console.log("Database is connected");
    } catch (error) {
      console.log(`Database is not connected: ${error.message}`);
    }
  })
  .on("error", (err) => {
    console.log(`Server is not running Error: ${err.message}`);
  });
