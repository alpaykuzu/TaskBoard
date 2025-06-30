import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type {
  TaskList as TaskListType,
  Task,
  UpdateTaskListData,
} from "../types/board";
import TaskCard from "./TaskCard";
import AddCardForm from "./AddCardForm";

type TaskListProps = {
  list: TaskListType;
  onCardAdded: (newTask: Task, listId: number) => void;
  onTaskDeleted: (taskId: number, listId: number) => void;
  onTaskUpdated: (updatedTask: Task) => void;
  onListDeleted: (listId: number) => void;
  onListUpdated: (listId: number, data: UpdateTaskListData) => void;
  onOpenCardDetail: (card: Task) => void;
};

function TaskList({
  list,
  onCardAdded,
  onTaskDeleted,
  onListDeleted,
  onListUpdated,
  onOpenCardDetail,
}: TaskListProps) {
  const { setNodeRef } = useDroppable({ id: list.id });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);

  const handleDeleteList = () => {
    if (
      window.confirm(
        `'${list.title}' sütununu silmek istediğinizden emin misiniz? İçindeki tüm kartlar da silinecektir.`
      )
    ) {
      onListDeleted(list.id);
    }
  };

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newTitle !== list.title) {
      onListUpdated(list.id, { title: newTitle });
    }
    setIsEditingTitle(false);
  };

  return (
    <div ref={setNodeRef} className="task-list">
      <div className="task-list-header">
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              autoFocus
              className="task-list-title-input"
            />
          </form>
        ) : (
          <h2 onClick={() => setIsEditingTitle(true)}>{list.title}</h2>
        )}
        <button onClick={handleDeleteList} className="delete-list-btn">
          ×
        </button>
      </div>
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
              onEdit={() => onOpenCardDetail(card)}
              // --- DÜZELTME: Hatalı onUpdate prop'u kaldırıldı. ---
              // onUpdate={(updateData: UpdateCardData) => onTaskUpdated({ ...card, ...updateData })}
            />
          ))}
        </div>
      </SortableContext>
      <AddCardForm listId={list.id} onCardAdded={onCardAdded} />
    </div>
  );
}

export default TaskList;
