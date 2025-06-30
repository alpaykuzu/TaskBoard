import type { LabelDto } from "./label";
import type { Task } from "./task";
// Task tipini bu dosyadan da erişilebilir kılmak için yeniden ihraç ediyoruz.
export type { Task };

// Sadece temel pano bilgisini temsil eder (Pano listesi sayfasında kullanılır).
export interface Board {
  id: number;
  title: string;
}

// Bir görev sütununu (liste) temsil eder.
export interface TaskList {
  id: number;
  title: string;
  order: number;
  taskCards: Task[];
}

// Bir panonun tüm detaylarını (kendisi + sütunları) temsil eder.
export interface BoardDetails extends Board {
  taskLists: TaskList[];
  labels: LabelDto[];
}

// Yeni pano oluşturma DTO'su.
export interface CreateBoardData {
  title: string;
}

// Yeni sütun oluşturma DTO'su.
export interface CreateTaskListData {
  title: string;
}

// Sütun başlığını güncelleme DTO'su.
export interface UpdateTaskListData {
  title: string;
}
