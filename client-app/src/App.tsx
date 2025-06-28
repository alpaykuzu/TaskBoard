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

import Header from "./components/Header";
import TaskList from "./components/TaskList";
import AddListForm from "./components/AddListForm";
import TaskCard from "./components/TaskCard";
import type { TaskList as TaskListType, Task } from "./types/task";
import { taskService } from "./services/taskService";
import "./App.css";

function App() {
  const [taskLists, setTaskLists] = useState<TaskListType[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Veriyi ilk yüklemede çeker
  useEffect(() => {
    taskService.getBoardData().then(setTaskLists);
  }, []);

  // Yeni bir SÜTUN eklendiğinde state'i günceller
  const handleListAdded = (newList: TaskListType) => {
    setTaskLists((currentLists) => [...currentLists, newList]);
  };

  // Yeni bir KART eklendiğinde ilgili sütunun state'ini günceller
  const handleCardAdded = (newTask: Task, listId: number) => {
    setTaskLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId
          ? { ...list, taskCards: [...list.taskCards, newTask] }
          : list
      )
    );
  };

  // Bir kart SİLİNDİĞİNDE state'i günceller
  const handleTaskDeleted = (taskId: number, listId: number) => {
    setTaskLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              taskCards: list.taskCards.filter((card) => card.id !== taskId),
            }
          : list
      )
    );
  };

  // Bir kart GÜNCELLENDİĞİNDE state'i günceller
  const handleTaskUpdated = (updatedTask: Task, listId: number) => {
    setTaskLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              taskCards: list.taskCards.map((card) =>
                card.id === updatedTask.id ? updatedTask : card
              ),
            }
          : list
      )
    );
  };

  // Sürükleme başladığında
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as number;
    const listContainingTask = taskLists.find((list) =>
      list.taskCards.some((card) => card.id === activeId)
    );
    const task = listContainingTask?.taskCards.find(
      (card) => card.id === activeId
    );
    if (task) setActiveTask(task);
  };

  // Sürükleme bittiğinde
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Aktif kartı her durumda temizle
    setActiveTask(null);

    if (!over) return;
    const activeId = active.id as number;
    const overId = over.id as number;
    if (activeId === overId) return;

    setTaskLists((lists) => {
      const startList = lists.find((list) =>
        list.taskCards.some((card) => card.id === activeId)
      );
      const endList =
        lists.find((list) => list.id === overId) ||
        lists.find((list) => list.taskCards.some((card) => card.id === overId));

      if (!startList || !endList) return lists;

      const draggedCard = startList.taskCards.find(
        (card) => card.id === activeId
      );
      if (!draggedCard) return lists;

      // Senaryo 1: Aynı sütun içinde sıralama
      if (startList.id === endList.id) {
        const oldCardIndex = startList.taskCards.findIndex(
          (card) => card.id === activeId
        );
        const newCardIndex = endList.taskCards.findIndex(
          (card) => card.id === overId
        );
        if (oldCardIndex === -1 || newCardIndex === -1) return lists;
        const updatedListTasks = arrayMove(
          startList.taskCards,
          oldCardIndex,
          newCardIndex
        );
        return lists.map((list) =>
          list.id === startList.id
            ? { ...list, taskCards: updatedListTasks }
            : list
        );
      }
      // Senaryo 2: Farklı sütunlar arasında taşıma
      else {
        taskService.moveTask(draggedCard.id, endList.id);
        return lists.map((list) => {
          if (list.id === startList.id) {
            return {
              ...list,
              taskCards: list.taskCards.filter((c) => c.id !== activeId),
            };
          }
          if (list.id === endList.id) {
            return { ...list, taskCards: [...list.taskCards, draggedCard] };
          }
          return list;
        });
      }
    });
  };

  // Sürükleme iptal edildiğinde
  const handleDragCancel = () => {
    setActiveTask(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div>
        <Header />
        <main className="board">
          {taskLists.map((list) => (
            <TaskList
              key={list.id}
              list={list}
              onCardAdded={handleCardAdded}
              onTaskDeleted={handleTaskDeleted}
              onTaskUpdated={handleTaskUpdated}
            />
          ))}
          <AddListForm onListAdded={handleListAdded} />
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

export default App;
