import express from "express";
import userRouter from "./users";
import applicationRouter from "./applications";
import commentsRouter from "./comments";

const apiV1Router = express.Router();

apiV1Router.use("/users", userRouter);
apiV1Router.use("/applications", applicationRouter);
apiV1Router.use("/comments", commentsRouter);
apiV1Router.use("/", (req, res, next) => {
  res.status(200).json({ message: "ok" });
});

export { apiV1Router };
