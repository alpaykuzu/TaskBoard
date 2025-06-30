import type { LabelDto } from "./label";

// Bir görev kartını temsil eder.
export interface Task {
  id: number;
  title: string;
  description: string;
  createdAt: string; // Tarihler JSON'da string olarak gelir
  dueDate?: string | null; // Opsiyonel veya null olabilir
  labels: LabelDto[];
}

// Bir görev sütununu temsil eder.
export interface TaskList {
  id: number;
  title: string;
  order: number;
  taskCards: Task[];
}

// Yeni bir kart oluştururken API'ye gönderilecek veri.
export type CreateTaskData = {
  title: string;
  description: string;
  taskListId: number;
  dueDate?: string | null;
};

// Yeni bir sütun oluştururken API'ye gönderilecek veri.
export type CreateTaskListData = {
  title: string;
};

// Bir kartı güncellerken API'ye gönderilecek veri.
export type UpdateTaskData = {
  title: string;
  description: string;
  dueDate?: string | null;
};
