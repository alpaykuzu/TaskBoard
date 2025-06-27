import type { TaskList as TaskListType, Task } from "../types/task";
import TaskCard from "./TaskCard";
import AddCardForm from "./AddCardForm";

type TaskListProps = {
  list: TaskListType;
  onCardAdded: (newTask: Task, listId: number) => void;
  onTaskDeleted: (taskId: number, listId: number) => void;
  onTaskUpdated: (updatedTask: Task, listId: number) => void;
};

function TaskList({
  list,
  onCardAdded,
  onTaskDeleted,
  onTaskUpdated,
}: TaskListProps) {
  return (
    <div className="task-list">
      <h2>{list.title}</h2>
      <div className="cards-container">
        {list.taskCards.map((card) => (
          <TaskCard
            key={card.id}
            task={card}
            onDelete={() => onTaskDeleted(card.id, list.id)}
            onUpdate={(updateData) =>
              onTaskUpdated({ ...card, ...updateData }, list.id)
            }
          />
        ))}
      </div>
      <AddCardForm taskListId={list.id} onCardAdded={onCardAdded} />
    </div>
  );
}

export default TaskList;
