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

  // Add Todo (React Hook Form + Mutation)
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
    <div style={{ maxWidth: "800px", margin: "30px auto", padding: "10px" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Your Todos</h2>
        <button
          onClick={logout}
          style={{
            padding: "8px 12px",
            border: "none",
            background: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* ADD TODO CARD */}
      <form
        onSubmit={handleSubmit((data) => addMutation.mutate(data))}
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Add New Todo</h3>

        <input
          type="text"
          placeholder="Title"
          {...register("title")}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />

        <textarea
          placeholder="Description"
          {...register("description")}
          rows={3}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        ></textarea>

        <button
          type="submit"
          style={{
            padding: "10px",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
            width: "100%",
            borderRadius: "5px",
          }}
        >
          Add Todo
        </button>
      </form>

      {/* TODO LIST */}
      {todos!.map((todo) => (
        <div
          key={todo._id}
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderLeft: todo.completed ? "6px solid green" : "6px solid orange",
          }}
        >
          <h3 style={{ margin: "0 0 5px" }}>{todo.title}</h3>
          <p style={{ margin: "0 0 10px", color: "#555" }}>
            {todo.description}
          </p>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* Toggle */}
            <button
              onClick={() => toggleMutation.mutate(todo._id)}
              style={{
                padding: "6px 10px",
                border: "none",
                cursor: "pointer",
                background: todo.completed ? "green" : "orange",
                color: "white",
                borderRadius: "5px",
              }}
            >
              {todo.completed ? "Completed" : "Mark Completed"}
            </button>

            {/* Delete */}
            <button
              onClick={() => deleteMutation.mutate(todo._id)}
              style={{
                padding: "6px 10px",
                border: "none",
                cursor: "pointer",
                background: "red",
                color: "white",
                borderRadius: "5px",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
