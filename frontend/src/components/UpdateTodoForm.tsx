import { useForm } from "react-hook-form";
import { Todo } from "../schemas/todo";
import "./UpdateTodoForm.css";

type UpdateTodoFormProps = {
  todo: Todo;
  onSubmit: (data: { title: string; description: string }) => void;
  onClose: () => void;
};

export const UpdateTodoForm = ({ todo, onSubmit, onClose }: UpdateTodoFormProps) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: todo.title,
      description: todo.description,
    },
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Update Todo</h2>

          <input
            type="text"
            placeholder="Title"
            {...register("title")}
            required
          />

          <textarea
            placeholder="Description"
            {...register("description")}
            rows={5}
          ></textarea>

          <div className="modal-actions">
            <button type="submit" className="submit-btn">Update</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
