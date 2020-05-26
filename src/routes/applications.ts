import express from "express";

import {
  getApplications,
  getAllApplications,
  createApplication,
} from "../controllers/applications";
import { Role } from "../util/role";
import { authorize } from "../util/auth";

const router = express.Router();

router.get("/", getApplications);
router.get("/all", authorize([Role.admin]), getAllApplications);

router.post("/", createApplication);

export default router;
