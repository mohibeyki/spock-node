import express, { Response, NextFunction, ErrorRequestHandler } from "express";
import compression from "compression"; // compresses requests
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bluebird from "bluebird";
import cors from "cors";
import jwt from "express-jwt";
import morgan from "morgan";

import { MONGODB_URI, JWT_SECRET } from "./util/secrets";
import { apiV1Router } from "./routes/api-v1-router";
import { HttpError } from "./errors/http";

const app = express();

const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err) => {
    console.log(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
  });

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return err.respond(res);
  }
  if (err.status && err.message) {
    return res
      .status(err.status)
      .json({ status: err.status, message: err.message });
  }
  res.status(500).json(err);
};

app.set("port", process.env.PORT);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("short"));
app.use(
  jwt({ secret: JWT_SECRET }).unless({
    path: [
      { url: "/api/v1", methods: ["GET"] },
      { url: "/api/v1/users", methods: ["POST"] },
      {
        url: "/api/v1/users/signin",
        methods: ["POST"],
      },
    ],
  })
);
app.use("/api/v1", apiV1Router);
app.use(errorHandler);

export default app;
