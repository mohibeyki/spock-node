import express from "express";
import {
  getComments,
  createComment,
  deleteComments,
} from "../controllers/comments";

const router = express.Router();

router.get("/:id", getComments);
router.post("/:id", createComment);
router.delete("/:id", deleteComments);

export default router;
