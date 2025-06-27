// src/components/AddCardForm.tsx

import { useState } from "react";
import type { Task, CreateTaskData } from "../types/task";
import { taskService } from "../services/taskService";

type AddCardFormProps = {
  taskListId: number;
  onCardAdded: (newTask: Task, taskListId: number) => void;
};

function AddCardForm({ taskListId, onCardAdded }: AddCardFormProps) {
  // Düzenleme modunun açık olup olmadığını tutan state
  const [isEditing, setIsEditing] = useState(false);

  // Form inputları için state'ler
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setIsEditing(false); // Başlık boşsa formu kapat
      return;
    }

    // API'ye gönderilecek veri hem başlığı hem de açıklamayı içeriyor
    const cardData: CreateTaskData = { title, description, taskListId };
    const newTask = await taskService.createTask(cardData);

    if (newTask) {
      // App.tsx'e haber vererek state'in güncellenmesini sağlıyoruz
      onCardAdded(newTask, taskListId);
    }

    // Formu sıfırla ve düzenleme modundan çık
    setTitle("");
    setDescription("");
    setIsEditing(false);
  };

  // Eğer düzenleme modunda değilsek, sadece butonu göster
  if (!isEditing) {
    return (
      <button className="add-card-btn" onClick={() => setIsEditing(true)}>
        + Yeni kart ekle
      </button>
    );
  }

  // Eğer düzenleme modundaysak, tam formu göster
  return (
    <form onSubmit={handleSubmit} className="add-card-form">
      {/* Kart Başlığı için alan */}
      <textarea
        className="add-card-textarea"
        placeholder="Bu kart için bir başlık girin..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      {/* Kart Açıklaması için YENİ alan */}
      <textarea
        className="add-card-textarea"
        placeholder="Açıklama ekleyin (isteğe bağlı)..."
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="add-card-form-actions">
        <button type="submit">Kart Ekle</button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => setIsEditing(false)}
        >
          X
        </button>
      </div>
    </form>
  );
}

export default AddCardForm;
