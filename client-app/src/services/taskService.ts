import type { Task, CreateTaskData, UpdateTaskData } from "../types/task";

// .NET API'mizin temel adresi
const API_BASE_URL = "https://localhost:7220/api";
export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: Task[] = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Görevleri çekerken bir hata oluştu:", error);
      // Hata durumunda boş bir dizi döndürerek uygulamanın çökmesini engelleyebiliriz
      return [];
    }
  },

  createTask: async (taskData: CreateTaskData): Promise<Task | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Görev oluşturulamadı.");
      }

      const newTaks: Task = await response.json();
      return newTaks;
    } catch (error) {
      console.error("Görev oluştururken bir hata oluştu:", error);
      return null;
    }
  },

  deleteTask: async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
      });
      // response.ok, 200-299 arası durum kodları için true döner.
      return response.ok;
    } catch (error) {
      console.error("Görev silinirken bir hata oluştu:", error);
      return false;
    }
  },

  updateTask: async (
    id: number,
    taskData: UpdateTaskData
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      return response.ok;
    } catch (error) {
      console.error("Görev güncellenirken bir hata oluştu:", error);
      return false;
    }
  },
};
