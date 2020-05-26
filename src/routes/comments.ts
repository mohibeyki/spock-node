import express from "express";
import { getComments, createComment } from "../controllers/comments";

const router = express.Router();

router.get("/:id", getComments);
router.post("/:id", createComment);

export default router;
