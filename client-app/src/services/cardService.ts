import { getAuthHeaders } from "./authHeader";
import type { Task, CreateTaskData, UpdateTaskData } from "../types/task";

const API_BASE_URL = "https://localhost:7220/api";

export const cardService = {
  createCard: async (taskData: CreateTaskData): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/taskcards`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error("Kart oluşturulamadı.");
    return await response.json();
  },

  updateCard: async (
    cardId: number,
    taskData: UpdateTaskData
  ): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/taskcards/${cardId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    return response.ok;
  },

  deleteCard: async (cardId: number): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/taskcards/${cardId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.ok;
  },

  moveCard: async (cardId: number, newListId: number): Promise<boolean> => {
    const response = await fetch(
      `${API_BASE_URL}/taskcards/${cardId}/move/${newListId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
      }
    );
    return response.ok;
  },
};
