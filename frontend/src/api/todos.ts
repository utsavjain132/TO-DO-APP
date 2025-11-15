import axios from "axios";
import { TodoListSchema, TodoSchema } from "../schemas/todo";
import { useAuth } from "../store/auth";

const API = "http://localhost:5000/api/todos";

export const fetchTodos = async () => {
  const token = useAuth.getState().token;
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return TodoListSchema.parse(res.data);
};

export const addTodo = async (data: { title: string; description: string }) => {
  const token = useAuth.getState().token;
  const res = await axios.post(API, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return TodoSchema.parse(res.data.todo);
};

export const updateTodo = async (id: string, data: any) => {
  const token = useAuth.getState().token;
  const res = await axios.put(`${API}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return TodoSchema.parse(res.data.todo);
};

export const toggleTodo = async (id: string) => {
  const token = useAuth.getState().token;
  const res = await axios.patch(`${API}/${id}/toggle`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return TodoSchema.parse(res.data.todo);
};

export const deleteTodo = async (id: string) => {
  const token = useAuth.getState().token;
  await axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
