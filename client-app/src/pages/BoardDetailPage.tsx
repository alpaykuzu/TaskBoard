import { useState, useEffect } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

import TaskList from "../components/TaskList";
import AddListForm from "../components/AddListForm";
import TaskCard from "../components/TaskCard";
import type {
  BoardDetails,
  CreateTaskListData,
  UpdateTaskListData,
} from "../types/board";
import type { Task } from "../types/task";
import { boardService } from "../services/boardService";
import { cardService } from "../services/cardService";

type BoardDetailPageProps = { boardId: number; onBack: () => void };

export function BoardDetailPage({ boardId, onBack }: BoardDetailPageProps) {
  const [boardDetails, setBoardDetails] = useState<BoardDetails | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    boardService
      .getBoardDetails(boardId)
      .then(setBoardDetails)
      .catch(console.error);
  }, [boardId]);

  const handleListAdded = async (listData: CreateTaskListData) => {
    const newList = await boardService.createTaskList(boardId, listData);
    if (newList)
      setBoardDetails((p) =>
        p ? { ...p, taskLists: [...p.taskLists, newList] } : null
      );
  };

  const handleCardAdded = async (newTask: Task, listId: number) => {
    setBoardDetails((p) =>
      p
        ? {
            ...p,
            taskLists: p.taskLists.map((l) =>
              l.id === listId
                ? { ...l, taskCards: [...l.taskCards, newTask] }
                : l
            ),
          }
        : null
    );
  };

  const handleTaskDeleted = (taskId: number, listId: number) => {
    setBoardDetails((p) =>
      p
        ? {
            ...p,
            taskLists: p.taskLists.map((l) =>
              l.id === listId
                ? {
                    ...l,
                    taskCards: l.taskCards.filter((c) => c.id !== taskId),
                  }
                : l
            ),
          }
        : null
    );
  };

  const handleTaskUpdated = (updatedTask: Task, listId: number) => {
    setBoardDetails((p) =>
      p
        ? {
            ...p,
            taskLists: p.taskLists.map((l) =>
              l.id === listId
                ? {
                    ...l,
                    taskCards: l.taskCards.map((c) =>
                      c.id === updatedTask.id ? updatedTask : c
                    ),
                  }
                : l
            ),
          }
        : null
    );
  };

  const handleListDeleted = async (listId: number) => {
    const success = await boardService.deleteTaskList(boardId, listId);
    if (success)
      setBoardDetails((p) =>
        p
          ? { ...p, taskLists: p.taskLists.filter((l) => l.id !== listId) }
          : null
      );
  };

  const handleListUpdated = async (
    listId: number,
    data: UpdateTaskListData
  ) => {
    const success = await boardService.updateTaskList(boardId, listId, data);
    if (success)
      setBoardDetails((p) =>
        p
          ? {
              ...p,
              taskLists: p.taskLists.map((l) =>
                l.id === listId ? { ...l, title: data.title } : l
              ),
            }
          : null
      );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = boardDetails?.taskLists
      .flatMap((l) => l.taskCards)
      .find((c) => c.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setBoardDetails((prev) => {
      if (!prev) return null;
      const lists = prev.taskLists;
      const startList = lists.find((l) =>
        l.taskCards.some((c) => c.id === active.id)
      );
      const endList = lists.find(
        (l) => l.id === over.id || l.taskCards.some((c) => c.id === over.id)
      );
      if (!startList || !endList) return prev;
      const draggedCard = startList.taskCards.find((c) => c.id === active.id)!;
      if (startList.id === endList.id) {
        const oldIndex = startList.taskCards.findIndex(
          (c) => c.id === active.id
        );
        const newIndex = endList.taskCards.findIndex((c) => c.id === over.id);
        const reorderedTasks = arrayMove(
          startList.taskCards,
          oldIndex,
          newIndex
        );
        return {
          ...prev,
          taskLists: lists.map((l) =>
            l.id === startList.id ? { ...l, taskCards: reorderedTasks } : l
          ),
        };
      } else {
        cardService.moveCard(draggedCard.id, endList.id);
        const newStartListTasks = startList.taskCards.filter(
          (c) => c.id !== active.id
        );
        const newEndListTasks = [...endList.taskCards, draggedCard];
        return {
          ...prev,
          taskLists: lists.map((l) => {
            if (l.id === startList.id)
              return { ...l, taskCards: newStartListTasks };
            if (l.id === endList.id)
              return { ...l, taskCards: newEndListTasks };
            return l;
          }),
        };
      }
    });
  };

  if (!boardDetails)
    return <div className="loading-screen">Pano Yükleniyor...</div>;

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="board-page">
        <header className="board-header">
          <button onClick={onBack} className="back-button">
            {"< Panolarım"}
          </button>
          <h1>{boardDetails.title}</h1>
          <div></div>
        </header>
        <main className="board">
          {boardDetails.taskLists.map((list) => (
            <TaskList
              key={list.id}
              list={list}
              boardId={boardId}
              onCardAdded={handleCardAdded}
              onTaskDeleted={handleTaskDeleted}
              onTaskUpdated={handleTaskUpdated}
              onListDeleted={handleListDeleted}
              onListUpdated={handleListUpdated}
            />
          ))}
          <AddListForm boardId={boardId} onListAdded={handleListAdded} />
        </main>
      </div>
      {createPortal(
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              onDelete={() => {}}
              onUpdate={() => {}}
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
