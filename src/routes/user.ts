import express from "express";

import { getSlash, postSlash, postSignin } from "../controllers/user";
// import { Role } from "../util/role";
// import { authorize } "../util/authorize";
import { body } from "express-validator";

const router = express.Router();

router.get("/", getSlash);
router.post(
  "/",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
    body("username").isLength({ min: 4 }),
  ],
  postSlash
);

router.post(
  "/signin",
  [
    body("username").isLength({ min: 4 }),
    body("password").isLength({ min: 8 }),
  ],
  postSignin
);

export default router;
