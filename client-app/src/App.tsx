import "./App.css";
import Header from "./components/Header";
import TaskCard from "./components/TaskCard";

function App() {
  return (
    <div>
      <Header />
      <main>
        <TaskCard
          title="Backend API'sini Kur"
          description="Clean Architecture kullanarak .NET 8 ile projeyi başlat."
        />
        <TaskCard
          title="React Projesini Başlat"
          description="Vite ve TypeScript kullanarak client-app oluştur."
        />
        <TaskCard
          title="İlk Bileşeni Oluştur"
          description="Header ve TaskCard bileşenlerini oluşturup Props mantığını anla."
        />
      </main>
    </div>
  );
}

export default App;
