import { z } from "zod";

export const TodoSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  completed: z.boolean(),
});

export const TodoListSchema = z.array(TodoSchema);

export type Todo = z.infer<typeof TodoSchema>;
