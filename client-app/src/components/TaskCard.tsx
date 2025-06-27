import { useState } from "react";
import type { Task, UpdateTaskData } from "../types/task";

// Bileşenin alacağı tüm propları içeren tip tanımı
type TaskCardProps = {
  task: Task;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: UpdateTaskData) => void;
};

function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  // Görevin tamamlanıp tamamlanmadığını tutan state
  const [isDone, setIsDone] = useState(false);
  // Kartın düzenleme modunda olup olmadığını tutan state
  const [isEditing, setIsEditing] = useState(false);

  // Düzenleme formundaki inputların değerlerini tutan state'ler
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  // Görevi tamamlandı veya geri al olarak işaretleyen fonksiyon
  const handleToggleDone = () => setIsDone(!isDone);

  // Sil butonuna tıklandığında çalışacak fonksiyon
  const handleDelete = () => {
    if (
      window.confirm(
        `'${task.title}' görevini silmek istediğinizden emin misiniz?`
      )
    ) {
      onDelete(task.id);
    }
  };

  // Düzenleme formundaki "Kaydet" butonuna basıldığında çalışacak fonksiyon
  const handleUpdateSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onUpdate(task.id, { title: editTitle, description: editDescription });
    setIsEditing(false); // Düzenleme modundan çık
  };

  // Eğer DÜZENLEME MODUNDAYSAK, bir form göster
  if (isEditing) {
    return (
      <form onSubmit={handleUpdateSubmit} className="task-card">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="edit-input" // Gerekirse CSS'te stil verebilirsin
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="edit-textarea" // Gerekirse CSS'te stil verebilirsin
        />
        <div className="task-actions">
          <button type="submit">Kaydet</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            İptal
          </button>
        </div>
      </form>
    );
  }

  // Eğer NORMAL MODDAYSAK, kartın kendisini göster
  return (
    <div className={`task-card ${isDone ? "done" : ""}`}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-actions">
        <button onClick={handleToggleDone}>
          {isDone ? "Geri Al" : "Tamamla"}
        </button>
        <button onClick={() => setIsEditing(true)}>Düzenle</button>
        <button className="delete-btn" onClick={handleDelete}>
          Sil
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
