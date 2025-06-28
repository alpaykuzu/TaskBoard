import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, UpdateTaskData } from "../types/task";
import { taskService } from "../services/taskService";

type TaskCardProps = {
  task: Task;
  onDelete: () => void;
  onUpdate: (data: UpdateTaskData) => void;
};

function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Sürüklenirken orijinal kartı yarım opak yapalım
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `'${task.title}' görevini silmek istediğinizden emin misiniz?`
      )
    ) {
      const success = await taskService.deleteTask(task.id);
      if (success) {
        onDelete();
      } else {
        alert("Görev silinemedi.");
      }
    }
  };

  const handleUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const updateData = { title: editTitle, description: editDescription };
    const success = await taskService.updateTask(task.id, updateData);
    if (success) {
      onUpdate(updateData);
      setIsEditing(false);
    } else {
      alert("Görev güncellenemedi.");
    }
  };

  if (isEditing) {
    return (
      // Düzenleme modu sürüklenemez
      <div className="task-card">
        <form onSubmit={handleUpdateSubmit}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-input"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="edit-textarea"
            rows={4}
          />
          <div className="task-actions">
            <button type="submit">Kaydet</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              İptal
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-actions">
        <button onClick={() => setIsEditing(true)}>Düzenle</button>
        <button className="delete-btn" onClick={handleDelete}>
          Sil
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
