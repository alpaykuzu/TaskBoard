import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types/task";
import { cardService } from "../services/cardService";

type TaskCardProps = {
  task: Task;
  onDelete: () => void;
  onEdit: () => void;
};

function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
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
    opacity: isDragging ? 0 : 1,
  };

  // Zaman barını doğru hesaplayan tam fonksiyon
  const renderTimeBar = () => {
    if (!task.dueDate || !task.createdAt) return null;
    const start = new Date(task.createdAt).getTime();
    const end = new Date(task.dueDate).getTime();
    const now = new Date().getTime();
    if (end <= start) return null;

    const totalDuration = end - start;
    const elapsedDuration = now - start;
    let progress = (elapsedDuration / totalDuration) * 100;
    progress = Math.max(0, Math.min(100, progress));

    let barColor = "#4caf50";
    if (progress > 50) barColor = "#ff9800";
    if (progress > 85) barColor = "#f44336";
    if (now > end) barColor = "#607d8b";

    return (
      <div
        className="time-bar-container"
        title={`Tamamlanma yüzdesi: %${Math.round(progress)}`}
      >
        <div
          className="time-bar-progress"
          style={{ width: `${progress}%`, backgroundColor: barColor }}
        />
      </div>
    );
  };

  // "Düzenle" butonuna basıldığında üst bileşeni bilgilendirir.
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  // "Sil" butonuna basıldığında API'ye istek gönderir ve üst bileşeni bilgilendirir.
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(
        `'${task.title}' görevini silmek istediğinizden emin misiniz?`
      )
    ) {
      cardService.deleteCard(task.id).then((success) => {
        if (success) {
          onDelete();
        } else {
          alert("Görev silinemedi.");
        }
      });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      {renderTimeBar()}

      {task.labels && task.labels.length > 0 && (
        <div className="card-labels-container">
          {task.labels.map((label) => (
            <span
              key={label.id}
              // --- ANA DÜZELTME ---
              // Artık her yerde kullanılan, esnek ve doğru stili uyguluyoruz.
              className="card-label"
              style={{ backgroundColor: label.color }}
            >
              {label.title}
            </span>
          ))}
        </div>
      )}

      <h3>{task.title}</h3>
      {task.dueDate && (
        <p className="due-date">
          Bitiş:{" "}
          {new Date(task.dueDate).toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
      <div className="task-actions">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleEditClick}
        >
          Düzenle
        </button>
        <button
          className="delete-btn"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleDeleteClick}
        >
          Sil
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
