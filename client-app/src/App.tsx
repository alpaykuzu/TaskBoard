import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { BoardsListPage } from "./pages/BoardsListPage";
import { BoardDetailPage } from "./pages/BoardDetailPage";
import "./App.css";

function App() {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<"auth" | "boards" | "boardDetail">("auth");
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);

  // Oturum durumu değiştiğinde view'i güncelle
  if (isAuthenticated && view === "auth") {
    setView("boards");
  } else if (!isAuthenticated && view !== "auth") {
    setView("auth");
    setSelectedBoardId(null);
  }

  const handleSelectBoard = (boardId: number) => {
    setSelectedBoardId(boardId);
    setView("boardDetail");
  };

  const handleBackToBoards = () => {
    setSelectedBoardId(null);
    setView("boards");
  };

  const [showLogin, setShowLogin] = useState(true);

  if (view === "auth") {
    return showLogin ? (
      <LoginPage onSwitchToRegister={() => setShowLogin(false)} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  if (view === "boards") {
    return <BoardsListPage onSelectBoard={handleSelectBoard} />;
  }

  if (view === "boardDetail" && selectedBoardId) {
    return (
      <BoardDetailPage boardId={selectedBoardId} onBack={handleBackToBoards} />
    );
  }

  return <div>Yükleniyor...</div>; // Veya bir hata sayfası
}

export default App;
