import express from "express";
import {
  createTodo,
  listTodos,
  updateTodo,
  deleteTodo,
  toggleTodo,
} from "../controllers/todoController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createTodo);
router.get("/", protect, listTodos);
router.put("/:id", protect, updateTodo);
router.delete("/:id", protect, deleteTodo);
router.patch("/:id/toggle", protect, toggleTodo);

export default router;
