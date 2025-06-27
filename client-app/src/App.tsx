import { useState, useEffect } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import AddListForm from "./components/AddListForm";
import type { TaskList as TaskListType, Task } from "./types/task";
import { taskService } from "./services/taskService";
import "./App.css";

function App() {
  const [taskLists, setTaskLists] = useState<TaskListType[]>([]);

  const fetchBoardData = () => {
    taskService.getBoardData().then(setTaskLists);
  };

  useEffect(() => {
    fetchBoardData();
  }, []);

  const handleListAdded = (newList: TaskListType) => {
    setTaskLists((currentLists) => [...currentLists, newList]);
  };

  const handleCardAdded = (newTask: Task, listId: number) => {
    setTaskLists((currentLists) =>
      currentLists.map((list) =>
        list.id === listId
          ? { ...list, taskCards: [...list.taskCards, newTask] }
          : list
      )
    );
  };

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

  return (
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
  );
}

export default App;
