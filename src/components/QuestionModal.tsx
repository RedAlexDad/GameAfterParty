import type { FC } from "react";
import { categories } from "../data";
import type { ModalState } from "../types";

interface QuestionModalProps {
  modal: ModalState;
  onSelectAnswer: (idx: number) => void;
  onContinue: () => void;
}

const QuestionModal: FC<QuestionModalProps> = ({
  modal,
  onSelectAnswer,
  onContinue,
}) => {
  if (!modal) return null;

  const { category, index } = modal;
  const question = categories[category][index];
  const imageSources = question.image
    ? Array.isArray(question.image)
      ? question.image
      : [question.image]
    : [];

  if (modal.phase === "question") {
    return (
      <div className="modal active">
        <div className="modal-content">
          <h2>
            {category} {question.points}⭐
          </h2>
          <div className="question-text">
            <p style={{ fontSize: "1.2em", color: "white" }}>
              {question.question}
            </p>
          </div>
          {imageSources.length > 0 && (
            <div className="question-image">
              {imageSources.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="Кадр или постер вопроса"
                  loading="lazy"
                />
              ))}
            </div>
          )}
          <div className="options-container">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                className="option-btn"
                onClick={() => onSelectAnswer(idx)}
              >
                {String.fromCharCode(65 + idx)}) {opt}
              </button>
            ))}
          </div>
          <div className="button-group">
            <button className="btn btn-neutral" onClick={onContinue}>
              ❌ Пропустить вопрос
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect = modal.isCorrect ?? false;
  const points = modal.points ?? question.points;

  return (
    <div className="modal active">
      <div className="modal-content">
        {isCorrect ? (
          <>
            <h2>✅ ПРАВИЛЬНО!</h2>
            <div className="emoji-decoration">🎉🎉🎉</div>
            <p style={{ color: "#11998e", fontSize: "1.3em" }}>
              Команда получает {points}⭐
            </p>
            <button className="btn btn-correct" onClick={onContinue}>
              ➡️ Продолжить
            </button>
          </>
        ) : (
          <>
            <h2>❌ НЕПРАВИЛЬНО!</h2>
            <div className="emoji-decoration">😅😢😭</div>
            <p style={{ color: "#eb3349", fontSize: "1.3em" }}>
              Команда теряет {Math.floor(points / 2)}⭐
            </p>
            <button className="btn btn-wrong" onClick={onContinue}>
              ➡️ Ход другой команде
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionModal;
