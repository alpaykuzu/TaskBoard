import { useState, useEffect } from "react";
import Modal from "react-modal";
import { Popover } from "react-tiny-popover";

import type { Task, UpdateTaskData } from "../types/task";
import type { LabelDto, CreateLabelDto } from "../types/label";
import { cardService } from "../services/cardService";
import { labelService } from "../services/labelService";

// Modal'ın ana uygulama elementini bilmesi, ekran okuyucular için önemlidir.
Modal.setAppElement("#root");

type CardDetailModalProps = {
  card: Task | null;
  boardId: number;
  boardLabels: LabelDto[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  onLabelsUpdate: (cardId: number, newLabels: LabelDto[]) => void;
  onNewLabelCreated: (newLabel: LabelDto) => void;
};

export function CardDetailModal({
  card,
  boardId,
  boardLabels,
  isOpen,
  onClose,
  onUpdate,
  onLabelsUpdate,
  onNewLabelCreated,
}: CardDetailModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLabelPopoverOpen, setIsLabelPopoverOpen] = useState(false);

  // Yeni etiket oluşturma formu için state'ler
  const [showNewLabelForm, setShowNewLabelForm] = useState(false);
  const [newLabelTitle, setNewLabelTitle] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#61bd4f"); // Varsayılan renk (Yeşil)

  // Modal açıldığında veya gösterilecek kart değiştiğinde,
  // form alanlarını o kartın bilgileriyle doldurur.
  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description);
    }
  }, [card]);

  const handleSave = async () => {
    if (!card || (title === card.title && description === card.description))
      return;

    const updateData: UpdateTaskData = {
      title,
      description,
      dueDate: card.dueDate,
    };
    const success = await cardService.updateCard(card.id, updateData);
    if (success) {
      onUpdate({ ...card, ...updateData });
    } else {
      alert("Görev güncellenemedi.");
    }
  };

  const handleToggleLabel = async (label: LabelDto) => {
    if (!card) return;
    const hasLabel = card.labels.some((l) => l.id === label.id);
    const apiCall = hasLabel
      ? labelService.removeLabelFromCard(card.id, label.id)
      : labelService.assignLabelToCard(card.id, label.id);

    const success = await apiCall;
    if (success) {
      const newLabels = hasLabel
        ? card.labels.filter((l) => l.id !== label.id)
        : [...card.labels, label];
      onLabelsUpdate(card.id, newLabels);
    }
  };

  const handleCreateNewLabel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabelTitle.trim()) return;

    const newLabelData: CreateLabelDto = {
      title: newLabelTitle,
      color: newLabelColor,
    };
    const createdLabel = await labelService.createLabelForBoard(
      boardId,
      newLabelData
    );

    if (createdLabel) {
      onNewLabelCreated(createdLabel); // Üst bileşene yeni etiketi bildir
      setNewLabelTitle("");
      setShowNewLabelForm(false);
    }
  };

  if (!card) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          className="modal-title-input"
        />
        <button onClick={onClose} className="modal-close-btn">
          ×
        </button>
      </div>

      <div className="modal-body">
        <div className="modal-section">
          <h3>Etiketler</h3>
          <div className="labels-container">
            {card.labels.map((label) => (
              <span
                key={label.id}
                className="card-label"
                style={{ backgroundColor: label.color }}
              >
                {label.title}
              </span>
            ))}
            <Popover
              isOpen={isLabelPopoverOpen}
              positions={["bottom", "right"]}
              padding={10}
              onClickOutside={() => setIsLabelPopoverOpen(false)}
              content={
                <div className="label-popover">
                  <h4>Etiketler</h4>
                  <ul className="label-popover-list">
                    {boardLabels.map((label) => {
                      const isChecked = card.labels.some(
                        (l) => l.id === label.id
                      );
                      return (
                        <li
                          key={label.id}
                          onClick={() => handleToggleLabel(label)}
                        >
                          <span
                            className={`checkbox ${isChecked ? "checked" : ""}`}
                          />
                          <span
                            className="card-label"
                            style={{ backgroundColor: label.color }}
                          >
                            {label.title}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <hr />
                  {showNewLabelForm ? (
                    <form
                      onSubmit={handleCreateNewLabel}
                      className="new-label-form"
                    >
                      <input
                        type="text"
                        placeholder="Yeni etiket adı..."
                        value={newLabelTitle}
                        onChange={(e) => setNewLabelTitle(e.target.value)}
                        autoFocus
                      />
                      <div className="new-label-colors">
                        {[
                          "#61bd4f",
                          "#f2d600",
                          "#ff9f1a",
                          "#eb5a46",
                          "#c377e0",
                          "#0079bf",
                        ].map((color) => (
                          <div
                            key={color}
                            className="color-box"
                            style={{ backgroundColor: color }}
                            onClick={() => setNewLabelColor(color)}
                          >
                            {newLabelColor === color && "✓"}
                          </div>
                        ))}
                      </div>
                      <button type="submit">Oluştur</button>
                    </form>
                  ) : (
                    <button
                      className="create-label-btn"
                      onClick={() => setShowNewLabelForm(true)}
                    >
                      Yeni bir etiket oluştur
                    </button>
                  )}
                </div>
              }
            >
              <button
                onClick={() => setIsLabelPopoverOpen(!isLabelPopoverOpen)}
                className="add-label-btn"
              >
                +
              </button>
            </Popover>
          </div>
        </div>

        <div className="modal-section">
          <label>Açıklama</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleSave}
            rows={5}
            placeholder="Açıklama ekleyin..."
          />
        </div>
      </div>
    </Modal>
  );
}
