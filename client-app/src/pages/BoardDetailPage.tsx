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
import { CardDetailModal } from "../components/CardDetailModal";
import type {
  BoardDetails,
  CreateTaskListData,
  UpdateTaskListData,
} from "../types/board";
import type { Task } from "../types/task";
import type { LabelDto } from "../types/label";
import { boardService } from "../services/boardService";
import { cardService } from "../services/cardService";

type BoardDetailPageProps = { boardId: number; onBack: () => void };

export function BoardDetailPage({ boardId, onBack }: BoardDetailPageProps) {
  const [boardDetails, setBoardDetails] = useState<BoardDetails | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  // Pano verisini API'den çeker
  useEffect(() => {
    boardService
      .getBoardDetails(boardId)
      .then(setBoardDetails)
      .catch(console.error);
  }, [boardId]);

  // Modal kontrol fonksiyonları
  const openCardModal = (card: Task) => {
    setSelectedCardId(card.id);
    setIsModalOpen(true);
  };
  const closeCardModal = () => {
    setIsModalOpen(false);
    setSelectedCardId(null);
  };

  // --- Tüm Olay Yöneticileri (Handlers) ---

  const handleListAdded = async (listData: CreateTaskListData) => {
    const newList = await boardService.createTaskList(boardId, listData);
    if (newList)
      setBoardDetails((p) =>
        p ? { ...p, taskLists: [...p.taskLists, newList] } : null
      );
  };

  const handleCardAdded = (newTask: Task, listId: number) => {
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

  const handleTaskUpdated = (updatedTask: Task) => {
    setBoardDetails((p) =>
      p
        ? {
            ...p,
            taskLists: p.taskLists.map((list) => ({
              ...list,
              taskCards: list.taskCards.map((card) =>
                card.id === updatedTask.id ? updatedTask : card
              ),
            })),
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

  const handleLabelsUpdate = (cardId: number, newLabels: LabelDto[]) => {
    setBoardDetails((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        taskLists: prev.taskLists.map((list) => ({
          ...list,
          taskCards: list.taskCards.map((card) =>
            card.id === cardId ? { ...card, labels: newLabels } : card
          ),
        })),
      };
    });
  };

  const handleNewLabelCreated = (newLabel: LabelDto) => {
    setBoardDetails((prev) => {
      if (!prev) return null;
      const existingLabels = prev.labels || [];
      return { ...prev, labels: [...existingLabels, newLabel] };
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = boardDetails?.taskLists
      .flatMap((l) => l.taskCards)
      .find((c) => c.id === event.active.id);
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
      if (!draggedCard) return prev;

      if (startList.id === endList.id) {
        const oldIndex = startList.taskCards.findIndex(
          (c) => c.id === active.id
        );
        const newIndex = endList.taskCards.findIndex((c) => c.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;
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

  const cardForModal =
    selectedCardId && boardDetails
      ? boardDetails.taskLists
          .flatMap((list) => list.taskCards)
          .find((card) => card.id === selectedCardId) || null
      : null;

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
              onCardAdded={handleCardAdded}
              onTaskDeleted={handleTaskDeleted}
              onTaskUpdated={handleTaskUpdated}
              onListDeleted={handleListDeleted}
              onListUpdated={handleListUpdated}
              onOpenCardDetail={openCardModal}
            />
          ))}
          <AddListForm boardId={boardId} onListAdded={handleListAdded} />
        </main>
      </div>
      <CardDetailModal
        isOpen={isModalOpen}
        onClose={closeCardModal}
        card={cardForModal}
        boardId={boardId}
        boardLabels={boardDetails.labels || []}
        onUpdate={(updatedTask) => {
          handleTaskUpdated(updatedTask);
          closeCardModal();
        }}
        onLabelsUpdate={handleLabelsUpdate}
        onNewLabelCreated={handleNewLabelCreated}
      />
      {createPortal(
        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
