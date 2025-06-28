import { useState, useEffect } from "react";
import { boardService } from "../services/boardService";
import { useAuth } from "../hooks/useAuth";
import type { Board } from "../types/board";

type BoardsListPageProps = {
  onSelectBoard: (boardId: number) => void;
};

export function BoardsListPage({ onSelectBoard }: BoardsListPageProps) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const { logout } = useAuth();

  useEffect(() => {
    boardService.getUserBoards().then(setBoards).catch(console.error);
  }, []);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    try {
      const newBoard = await boardService.createBoard({ title: newBoardTitle });
      setBoards((currentBoards) => [...currentBoards, newBoard]);
      setNewBoardTitle("");
    } catch (error) {
      console.error("Pano oluşturulamadı:", error);
    }
  };

  return (
    <div className="boards-list-container">
      <header className="board-header">
        <h1>Panolarım</h1>
        <button onClick={logout} className="logout-button">
          Çıkış Yap
        </button>
      </header>
      <main className="boards-list-main">
        <div className="boards-grid">
          {boards.map((board) => (
            <div
              key={board.id}
              className="board-tile"
              onClick={() => onSelectBoard(board.id)}
            >
              {board.title}
            </div>
          ))}
          <div className="board-tile add-board-tile">
            <form onSubmit={handleCreateBoard}>
              <input
                type="text"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                placeholder="Yeni pano başlığı..."
              />
              <button type="submit">Oluştur</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
