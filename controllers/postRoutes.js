import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  addReply,
  upvotePost,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/:id/reply", addReply);
router.post("/:id/upvote", upvotePost);

export default router;
