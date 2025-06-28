import { getAuthHeaders } from "./authHeader";
import type {
  Board,
  BoardDetails,
  TaskList,
  CreateBoardData,
  CreateTaskListData,
  UpdateTaskListData,
} from "../types/board";

const API_BASE_URL = "https://localhost:7220/api"; // KENDİ PORT NUMARANIZI KULLANIN

export const boardService = {
  // Giriş yapmış kullanıcının tüm panolarını getirir
  getUserBoards: async (): Promise<Board[]> => {
    const response = await fetch(`${API_BASE_URL}/boards`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Panolar alınamadı.");
    return await response.json();
  },

  // Belirli bir panonun tüm detaylarını (sütunlar ve kartlar) getirir
  getBoardDetails: async (boardId: number): Promise<BoardDetails> => {
    const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Pano detayları alınamadı.");
    return await response.json();
  },

  // Yeni bir pano oluşturur
  createBoard: async (boardData: CreateBoardData): Promise<Board> => {
    const response = await fetch(`${API_BASE_URL}/boards`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(boardData),
    });
    if (!response.ok) throw new Error("Pano oluşturulamadı.");
    return await response.json();
  },

  // Belirli bir panoya yeni bir sütun oluşturur
  createTaskList: async (
    boardId: number,
    listData: CreateTaskListData
  ): Promise<TaskList> => {
    const response = await fetch(
      `${API_BASE_URL}/boards/${boardId}/tasklists`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(listData),
      }
    );
    if (!response.ok) throw new Error("Sütun oluşturulamadı.");
    return await response.json();
  },

  updateTaskList: async (
    boardId: number,
    listId: number,
    data: UpdateTaskListData
  ): Promise<boolean> => {
    const response = await fetch(
      `${API_BASE_URL}/boards/${boardId}/tasklists/${listId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
    return response.ok;
  },

  deleteTaskList: async (boardId: number, listId: number): Promise<boolean> => {
    const response = await fetch(
      `${API_BASE_URL}/boards/${boardId}/tasklists/${listId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );
    return response.ok;
  },
};
