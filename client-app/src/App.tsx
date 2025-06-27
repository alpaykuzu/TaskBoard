// src/App.tsx
import { useState, useEffect } from "react";
import Header from "./components/Header";
import TaskCard from "./components/TaskCard";
import AddTaskForm from "./components/AddTaskForm";
import type { Task, UpdateTaskData } from "./types/task";
import { taskService } from "./services/taskService";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Görevleri çeken bir fonksiyon tanımlayalım ki tekrar tekrar kullanabilelim
  const fetchAndSetTasks = () => {
    taskService.getTasks().then((data) => {
      setTasks(data);
    });
  };

  useEffect(() => {
    fetchAndSetTasks(); // Bileşen ilk yüklendiğinde görevleri çek
  }, []);

  // Form bileşeninden gelen "görev eklendi" haberini yakalayan fonksiyon
  const handleTaskAdded = () => {
    // Yeni görev eklendikten sonra listeyi tazelemek için görevleri yeniden çekiyoruz.
    fetchAndSetTasks();
  };

  const handleDeleteTask = async (id: number) => {
    const success = await taskService.deleteTask(id);
    if (success) {
      // API'den listeyi tekrar çekmek yerine, state'i manuel olarak güncellemek
      // daha verimli ve hızlı bir kullanıcı deneyimi sunar.
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } else {
      alert("Görev silinemedi. Lütfen tekrar deneyin.");
    }
  };

  const handleUpdateTask = async (id: number, updateData: UpdateTaskData) => {
    const success = await taskService.updateTask(id, updateData);
    if (success) {
      // Listeyi yeniden çekmek yerine, sadece güncellenen elemanı state'te değiştir. Daha verimli!
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? { ...task, ...updateData } : task
        )
      );
    } else {
      alert("Görev güncellenemedi.");
    }
  };

  return (
    <div>
      <Header />
      <main className="board-container">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask} // Update prop'unu bağlıyoruz
          />
        ))}
      </main>
      <AddTaskForm onTaskAdded={handleTaskAdded} />
    </div>
  );
}

export default App;
