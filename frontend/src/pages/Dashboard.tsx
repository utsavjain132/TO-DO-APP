import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { useForm } from "react-hook-form";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchTodos,
  addTodo,
  deleteTodo,
  toggleTodo,
} from "../api/todos";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to login if no token
  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  // Fetch todos
  const { data: todos, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  // Add Todo 
  type TodoForm = {
  title: string;
  description: string;
};

const { register, handleSubmit, reset } = useForm<TodoForm>();


  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      reset();
    },
  });

  // Toggle todo
  const toggleMutation = useMutation({
    mutationFn: toggleTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // Delete todo
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isLoading) return <p>Loading todos...</p>;
  if (isError) return <p>Failed to load todos.</p>;

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Your Todos</h2>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* ADD TODO CARD */}
      <form
        onSubmit={handleSubmit((data) => addMutation.mutate(data))}
        className="add-todo-form"
      >
        <h3>Add New Todo</h3>
        <input
          type="text"
          placeholder="Title"
          {...register("title")}
          required
        />
        <textarea
          placeholder="Description"
          {...register("description")}
          rows={3}
        ></textarea>
        <button type="submit">Add Todo</button>
      </form>

      {/* TODO LIST */}
      {todos!.map((todo) => (
        <div
          key={todo._id}
          className={`todo-item ${todo.completed ? "completed" : "pending"}`}>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>

          <div className="todo-actions">
            {/* Toggle */}
            <button
              onClick={() => toggleMutation.mutate(todo._id)}
              className={`toggle-btn ${todo.completed ? "completed" : "pending"}`}>
              {todo.completed ? "Completed" : "Mark Completed"}
            </button>

            {/* Delete */}
            <button
              onClick={() => deleteMutation.mutate(todo._id)}
              className="delete-btn">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
