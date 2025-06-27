import type {
  Task,
  TaskList,
  CreateTaskData,
  CreateTaskListData,
  UpdateTaskData,
} from "../types/task";

const API_BASE_URL = "https://localhost:7220/api"; // KENDİ PORT NUMARANI KULLAN

export const taskService = {
  getBoardData: async (): Promise<TaskList[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasklists`); // YENİ ADRES
      if (!response.ok) throw new Error("Pano verisi alınamadı.");
      return await response.json();
    } catch (error) {
      console.error("Pano verisi alınırken hata:", error);
      return [];
    }
  },

  createTaskList: async (
    listData: CreateTaskListData
  ): Promise<TaskList | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasklists`, {
        // YENİ ADRES
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listData),
      });
      if (!response.ok) throw new Error("Sütun oluşturulamadı.");
      return await response.json();
    } catch (error) {
      console.error("Sütun oluşturulurken hata:", error);
      return null;
    }
  },

  createTask: async (taskData: CreateTaskData): Promise<Task | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/taskcards`, {
        // YENİ ADRES
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("Kart oluşturulamadı.");
      return await response.json();
    } catch (error) {
      console.error("Kart oluşturulurken hata:", error);
      return null;
    }
  },

  updateTask: async (
    id: number,
    taskData: UpdateTaskData
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/taskcards/${id}`, {
        // YENİ ADRES
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      return response.ok;
    } catch (error) {
      console.error("Kart güncellenirken hata:", error);
      return false;
    }
  },

  deleteTask: async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/taskcards/${id}`, {
        // YENİ ADRES
        method: "DELETE",
      });
      return response.ok;
    } catch (error) {
      console.error("Kart silinirken hata:", error);
      return false;
    }
  },
};
