import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tr } from "date-fns/locale";

import type { Task, CreateTaskData } from "../types/task";
import { cardService } from "../services/cardService";

registerLocale("tr", tr);

type AddCardFormProps = {
  listId: number;
  onCardAdded: (newTask: Task, listId: number) => void;
};

function AddCardForm({ listId, onCardAdded }: AddCardFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setIsEditing(false);
      return;
    }
    const cardData: CreateTaskData = {
      title,
      description,
      taskListId: listId,
      dueDate: dueDate ? dueDate.toISOString() : null,
    };
    try {
      const newTask = await cardService.createCard(cardData);
      if (newTask) onCardAdded(newTask, listId);
    } catch (error) {
      console.error("Kart oluşturulamadı:", error);
    }
    setTitle("");
    setDescription("");
    setDueDate(null);
    setIsEditing(false);
  };

  const filterPassedTimes = (time: Date) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
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
      <div className="form-date-input-container">
        <DatePicker
          locale="tr"
          selected={dueDate}
          onChange={(date: Date | null) => setDueDate(date)}
          showTimeSelect
          minDate={new Date()}
          filterTime={filterPassedTimes}
          dateFormat="d MMMM yyyy, HH:mm"
          className="date-picker-input"
          placeholderText="Bitiş tarihi ekle..."
          isClearable
        />
      </div>
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
