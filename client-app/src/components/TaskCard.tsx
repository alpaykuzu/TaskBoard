import { useState } from "react";

type TaskCardProps = {
  title: string;
  description: string;
};

function TaskCard({ title, description }: TaskCardProps) {
  // isDone: state'in anlık değerini tutan değişken (okumak için).
  // setIsDone: bu state'i güncellememizi sağlayan fonksiyon.
  // useState(false): state'in başlangıç değeri. Kart ilk başta tamamlanmamış (false) olacak.
  const [isDone, setIsDone] = useState(false);

  // Butona tıklandığında çalışacak fonksiyon
  const handleToggleDone = () => {
    // State'i güncellemek için setIsDone fonksiyonunu kullanıyoruz.
    // Mevcut değerin tersini (false ise true, true ise false) ayarlıyoruz.
    setIsDone(!isDone);
  };

  return (
    <div className={`task-card ${isDone ? "done" : ""}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={handleToggleDone}>
        {isDone ? "Geri Al" : "Tamamlandı Olarak İşaretle"}
      </button>
    </div>
  );
}

export default TaskCard;
