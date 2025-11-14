import { Response } from "express";
import { Todo } from "../models/Todo";
import { AuthRequest } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";

// Create Todo
export const createTodo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description } = req.body;

  const todo = await Todo.create({
    user: req.user._id,
    title,
    description,
  });

  res.status(201).json({
    message: "Todo created",
    todo,
  });
});

// List Todos
export const listTodos = asyncHandler(async (req: AuthRequest, res: Response) => {
  const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.json(todos);
});

// Update Todo
export const updateTodo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const todo = await Todo.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { title, description },
    { new: true }
  );

  if (!todo) throw new Error("Todo not found");

  res.json({
    message: "Todo updated",
    todo,
  });
});

// Delete Todo
export const deleteTodo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const todo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });

  if (!todo) throw new Error("Todo not found");

  res.json({
    message: "Todo deleted",
  });
});

// Toggle Completed
export const toggleTodo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const todo = await Todo.findOne({ _id: id, user: req.user._id });

  if (!todo) throw new Error("Todo not found");

  todo.completed = !todo.completed;
  await todo.save();

  res.json({
    message: "Todo status updated",
    todo,
  });
});
