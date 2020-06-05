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
    body("email")
      .isEmail()
      .withMessage("invalid email address")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("needs to be at least 8 characters"),
    body("username")
      .isLength({ min: 4 })
      .withMessage("needs to be at least 4 characters"),
  ],
  createUser
);
router.post(
  "/signin",
  [
    body("email")
      .isEmail()
      .withMessage("invalid email address")
      .isLength({ min: 8 })
      .withMessage("needs to be at least 8 characters")
      .normalizeEmail(),
  ],
  postSignin
);

export default router;
