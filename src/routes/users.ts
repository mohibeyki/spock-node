import express from "express";
import { body } from "express-validator";
import { createUser, getUsers, postSignin } from "../controllers/user";
import { authorize } from "../util/auth";
import { Role } from "../util/role";

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
router.post(
  "/signin",
  [
    body("email").isEmail().normalizeEmail(),
    body("email").isLength({ min: 4 }),
  ],
  postSignin
);

export default router;
