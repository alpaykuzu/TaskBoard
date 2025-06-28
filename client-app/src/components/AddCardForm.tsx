import { useState } from "react";
import type { Task, CreateTaskData } from "../types/task";
import { cardService } from "../services/cardService";

// 1. DÜZELTME: Props tip tanımına 'taskListId' eklendi.
type AddCardFormProps = {
  listId: number; // Daha tutarlı olması için adını 'listId' yapalım
  onCardAdded: (newTask: Task, listId: number) => void;
};

// Props'tan 'listId' olarak alıyoruz.
function AddCardForm({ listId, onCardAdded }: AddCardFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setIsEditing(false);
      return;
    }

    // 2. DÜZELTME: 'cardData' objesini oluştururken backend'in beklediği
    // 'taskListId' alanına, props'tan gelen 'listId' değerini atıyoruz.
    const cardData: CreateTaskData = { title, description, taskListId: listId };

    try {
      const newTask = await cardService.createCard(cardData);
      if (newTask) {
        onCardAdded(newTask, listId);
      }
    } catch (error) {
      console.error("Kart oluşturulamadı:", error);
      alert("Kart oluşturulurken bir hata oluştu.");
    }

    setTitle("");
    setDescription("");
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button className="add-card-btn" onClick={() => setIsEditing(true)}>
        + Yeni kart ekle
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="add-card-form">
      <textarea
        className="add-card-textarea"
        placeholder="Bu kart için bir başlık girin..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
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
