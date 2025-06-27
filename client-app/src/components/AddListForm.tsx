import { useState } from "react";
import { taskService } from "../services/taskService";
import type { TaskList, CreateTaskListData } from "../types/task";

type AddListFormProps = {
  onListAdded: (newList: TaskList) => void;
};

function AddListForm({ onListAdded }: AddListFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      alert("Sütun başlığı boş olamaz!");
      return;
    }
    const listData: CreateTaskListData = { title };
    const newList = await taskService.createTaskList(listData);
    if (newList) {
      onListAdded(newList);
      setTitle("");
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
