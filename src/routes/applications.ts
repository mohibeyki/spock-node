import express from "express";

import {
  getApplications,
  getAllApplications,
  createApplication,
  deleteApplication,
} from "../controllers/applications";
import { Role } from "../util/role";
import { authorize } from "../util/auth";
import { body } from "express-validator";

const router = express.Router();

router.get("/", getApplications);
router.get("/all", authorize([Role.admin]), getAllApplications);

router.post(
  "/",
  [
    body("company").isLength({ min: 1 }),
    body("position").isLength({ min: 1 }),
    body("submissionLink").isLength({ min: 1 }),
    body("status").isLength({ min: 1 }),
  ],
  createApplication
);
router.delete("/:id", deleteApplication);

export default router;
