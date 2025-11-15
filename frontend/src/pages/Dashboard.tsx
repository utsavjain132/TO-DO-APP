import { useEffect, useState } from "react";
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
  updateTodo,
} from "../api/todos";
import { UpdateTodoForm } from "../components/UpdateTodoForm";
import "./Dashboard.css";
import type { Todo } from "../schemas/todo";

// Form type that matches Zod + Update form
type TodoForm = {
  title: string;
  description: string | null | undefined;
};

function Dashboard() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  // Fetch all todos
  const { data: todos, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  // Add new todo form
  const { register, handleSubmit, reset } = useForm<TodoForm>();

  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (variables: { id: string; data: TodoForm }) =>
      updateTodo(variables.id, {
        title: variables.data.title,
        description: variables.data.description || "", // normalize description
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsModalOpen(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  if (isLoading) return <p>Loading todos...</p>;
  if (isError) return <p>Failed to load todos.</p>;

  const openModal = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Your Todos</h2>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      {/* ADD TODO */}
      <form
        onSubmit={handleSubmit((data) =>
          addMutation.mutate({
            title: data.title,
            description: data.description || "", // normalize description
          })
        )}
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
          className={`todo-item ${todo.completed ? "completed" : "pending"}`}
        >
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>

          <div className="todo-actions">
            {/* Update */}
            <button onClick={() => openModal(todo)} className="update-btn">
              Update
            </button>

            {/* Toggle */}
            <button
              onClick={() => toggleMutation.mutate(todo._id)}
              className={`toggle-btn ${
                todo.completed ? "completed" : "pending"
              }`}
            >
              {todo.completed ? "Completed" : "Mark Completed"}
            </button>

            {/* Delete */}
            <button
              onClick={() => deleteMutation.mutate(todo._id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* UPDATE MODAL */}
      {isModalOpen && selectedTodo && (
        <UpdateTodoForm
          todo={selectedTodo}
          onSubmit={(data) =>
            updateMutation.mutate({
              id: selectedTodo._id,
              data,
            })
          }
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
