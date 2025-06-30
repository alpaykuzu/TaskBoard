import { useState } from "react";
import { boardService } from "../services/boardService";
import type { CreateTaskListData, TaskList } from "../types/board";

type AddListFormProps = {
  boardId: number;
  onListAdded: (newList: TaskList) => void;
};

function AddListForm({ boardId, onListAdded }: AddListFormProps) {
  const [title, setTitle] = useState("");
  // 1. İşlemin devam edip etmediğini tutan yeni bir state ekliyoruz.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || isSubmitting) {
      return;
    }

    // 2. İstek başlamadan önce butonu devre dışı bırakıyoruz.
    setIsSubmitting(true);

    const listData: CreateTaskListData = { title };

    try {
      const newList = await boardService.createTaskList(boardId, listData);
      if (newList) {
        onListAdded(newList);
        setTitle("");
      }
    } catch (error) {
      console.error("Sütun oluşturulamadı:", error);
      alert("Sütun oluşturulurken bir hata oluştu.");
    } finally {
      // 3. İstek başarılı da olsa, hata da alsa, işlem bittiğinde butonu tekrar aktif hale getiriyoruz.
      setIsSubmitting(false);
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
          disabled={isSubmitting} // Butonla birlikte input'u da devre dışı bırakabiliriz.
        />
        {/* 4. Butonu 'isSubmitting' durumuna göre devre dışı bırakıyoruz. */}
        <button
          type="submit"
          style={{ marginTop: "8px" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Ekleniyor..." : "Sütun Ekle"}
        </button>
      </form>
    </div>
  );
}

export default AddListForm;
