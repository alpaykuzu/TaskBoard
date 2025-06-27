export interface Task {
  id: number;
  title: string;
  description: string;
}

export type CreateTaskData = {
  title: string;
  description: string;
};

export type UpdateTaskData = {
  title: string;
  description: string;
};
