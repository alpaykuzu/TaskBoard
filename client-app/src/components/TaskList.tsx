import type { TaskList as TaskListType, Task } from "../types/task";
import TaskCard from "./TaskCard";
import AddCardForm from "./AddCardForm";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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
  const { setNodeRef } = useDroppable({ id: list.id });

  return (
    <div ref={setNodeRef} className="task-list">
      <h2>{list.title}</h2>
      <SortableContext
        items={list.taskCards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
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
      </SortableContext>
      <AddCardForm taskListId={list.id} onCardAdded={onCardAdded} />
    </div>
  );
}

export default TaskList;
