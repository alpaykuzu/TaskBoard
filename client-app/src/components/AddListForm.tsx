import { useState } from "react";
import { boardService } from "../services/boardService";
import type { CreateTaskListData, TaskList } from "../types/board";

// 1. ADIM: Props tip tanımına boardId eklendi.
type AddListFormProps = {
  boardId: number;
  onListAdded: (newList: TaskList) => void;
};

function AddListForm({ boardId, onListAdded }: AddListFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      alert("Sütun başlığı boş olamaz!");
      return;
    }

    const listData: CreateTaskListData = { title };

    try {
      // 2. ADIM: Servis fonksiyonu artık doğru boardId ile çağrılıyor.
      const newList = await boardService.createTaskList(boardId, listData);
      if (newList) {
        onListAdded(newList);
        setTitle("");
      }
    } catch (error) {
      console.error("Sütun oluşturulamadı:", error);
      alert("Sütun oluşturulurken bir hata oluştu.");
    }
  };

  return (
    <div className="task-list add-list-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="+ Yeni bir sütun ekle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="add-list-input"
        />
        <button type="submit" style={{ marginTop: "8px" }}>
          Sütun Ekle
        </button>
      </form>
    </div>
  );
}

export default AddListForm;
