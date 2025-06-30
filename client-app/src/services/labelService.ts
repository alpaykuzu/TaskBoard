import type { CreateLabelDto, LabelDto } from "../types/label";
import { getAuthHeaders } from "./authHeader";

const API_BASE_URL = "https://localhost:7220/api";

export const labelService = {
  getLabelsForBoard: async (boardId: number): Promise<LabelDto[]> => {
    const response = await fetch(`${API_BASE_URL}/boards/${boardId}/labels`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Etiketler alınamadı.");
    return await response.json();
  },
  createLabelForBoard: async (
    boardId: number,
    data: CreateLabelDto
  ): Promise<LabelDto> => {
    const response = await fetch(`${API_BASE_URL}/boards/${boardId}/labels`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Etiket oluşturulamadı.");
    return await response.json();
  },
  assignLabelToCard: async (
    cardId: number,
    labelId: number
  ): Promise<boolean> => {
    const response = await fetch(
      `${API_BASE_URL}/taskcards/${cardId}/labels/${labelId}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );
    return response.ok;
  },
  removeLabelFromCard: async (
    cardId: number,
    labelId: number
  ): Promise<boolean> => {
    const response = await fetch(
      `${API_BASE_URL}/taskcards/${cardId}/labels/${labelId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
    return response.ok;
  },
};
