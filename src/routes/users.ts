import express from "express";

import { getUsers, createUser, postSignin } from "../controllers/user";
import { Role } from "../util/role";
import { authorize } from "../util/auth";
import { body } from "express-validator";

const router = express.Router();

router.get("/", authorize([Role.admin]), getUsers);
router.post(
  "/",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
    body("username").isLength({ min: 4 }),
  ],
  createUser
);
router.post("/signin", [body("email").isLength({ min: 4 })], postSignin);

export default router;
