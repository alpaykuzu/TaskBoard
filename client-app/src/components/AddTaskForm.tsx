import { useState } from "react";
import { taskService } from "../services/taskService";

type AddTaskFormProps = {
  onTaskAdded: () => void;
};

function AddTaskForm({ onTaskAdded }: AddTaskFormProps) {
  // Formdaki input alanlarının değerlerini tutmak için state'ler
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Form gönderildiğinde (submit) çalışacak fonksiyon
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

    if (!title) {
      alert("Başlık alanı zorunludur!");
      return;
    }

    // Henüz API'ye bağlamadık, sadece logluyoruz
    const newTask = await taskService.createTask({ title, description });

    // Eğer görev başarıyla oluşturulduysa...
    if (newTask) {
      setTitle("");
      setDescription("");
      onTaskAdded(); // App.tsx'e haber ver ki listeyi güncellesin
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <h3>Yeni Görev Ekle</h3>
      <input
        type="text"
        placeholder="Görev Başlığı"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Açıklama"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Ekle</button>
    </form>
  );
}

export default AddTaskForm;
