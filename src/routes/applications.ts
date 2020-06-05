import express from "express";

import {
  getApplications,
  getAllApplications,
  createApplication,
  deleteApplication,
} from "../controllers/applications";
import { Role } from "../util/role";
import { authorize } from "../util/auth";
import { check } from "express-validator";

const router = express.Router();

router.get("/", getApplications);
router.get("/all", authorize([Role.admin]), getAllApplications);

router.post(
  "/",
  [
    check("company").isLength({ min: 3, max: 64 }),
    check("position").isLength({ min: 3, max: 64 }),
    check("submissionLink").isLength({ min: 3, max: 256 }),
    check("status").isLength({ min: 3, max: 64 }),
    check("submissionDate").isISO8601(),
  ],
  createApplication
);
router.delete("/:id", deleteApplication);

export default router;
