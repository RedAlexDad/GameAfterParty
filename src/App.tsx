import React, { useMemo, useState } from "react";
import "./App.css";
import { categories } from "./data";
import type { CategoryKey, GameState, ScoreSnapshot, TeamId } from "./types";

const initialState: GameState = {
  team1: 0,
  team2: 0,
  currentTeam: 1,
  answeredQuestions: {},
  gameOver: false,
  history: [],
};

type ModalState = {
  category: CategoryKey;
  index: number;
  phase: "question" | "result";
  isCorrect?: boolean;
  points?: number;
  selectedIdx?: number;
} | null;

const HISTORY_ENDPOINT = "http://localhost:4000/history";

const sendHistoryToServer = async (history: ScoreSnapshot[]) => {
  try {
    await fetch(HISTORY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history }),
    });
  } catch (error) {
    console.error("Не удалось отправить историю на сервер", error);
  }
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [modal, setModal] = useState<ModalState>(null);

  const categoryNames = useMemo(
    () => Object.keys(categories) as CategoryKey[],
    []
  );
  const totalQuestions = useMemo(
    () => categoryNames.reduce((sum, key) => sum + categories[key].length, 0),
    [categoryNames]
  );
  const subtitle = useMemo(() => categoryNames.join(" | "), [categoryNames]);

  const openQuestion = (category: CategoryKey, index: number) => {
    const key = `${category}-${index}`;
    if (gameState.answeredQuestions[key]) {
      alert("Этот вопрос уже отвечен!");
      return;
    }
    setModal({ category, index, phase: "question" });
  };
  const handleAnswer = (selectedIdx: number) => {
    if (!modal || modal.phase !== "question") return;
    const { category, index } = modal;
    const question = categories[category][index];

    const isCorrect = selectedIdx === question.correct;
    const points = question.points;
    const key = `${category}-${index}`;

    // считаем новые очки явно
    const answeringTeam: TeamId = gameState.currentTeam;
    let team1 = gameState.team1;
    let team2 = gameState.team2;

    if (isCorrect) {
      if (answeringTeam === 1) {
        team1 += points;
      } else {
        team2 += points;
      }
    } else {
      const penalty = Math.floor(points / 2);
      if (answeringTeam === 1) {
        team1 -= penalty;
      } else {
        team2 -= penalty;
      }
    }

    // ход передается другой команде после любого ответа
    const currentTeam: TeamId = answeringTeam === 1 ? 2 : 1;

    const snapshot: ScoreSnapshot = {
      time: new Date().toISOString(),
      team1,
      team2,
      currentTeam,
      questionKey: key,
      points,
      correct: isCorrect,
    };

    const newState: GameState = {
      ...gameState,
      team1,
      team2,
      currentTeam,
      answeredQuestions: {
        ...gameState.answeredQuestions,
        [key]: true,
      },
      history: [...gameState.history, snapshot],
    };

    localStorage.setItem(
      "svoya-igra-history",
      JSON.stringify(newState.history)
    );
    void sendHistoryToServer(newState.history);

    setGameState(newState);
    setModal({
      category,
      index,
      phase: "result",
      isCorrect,
      points,
      selectedIdx,
    });
  };

  const continueGame = () => {
    if (!modal) return;
    const allAnswered =
      Object.keys(gameState.answeredQuestions).length === totalQuestions;

    if (allAnswered) {
      setModal(null);
      // можно вывести отдельную модалку конца игры
    } else {
      setModal(null);
    }
  };

  const resetGame = () => {
    setGameState(initialState);
    localStorage.removeItem("svoya-igra-history");
    setModal(null);
  };

  return (
    <div className="game-container">
      <div className="header">
        <h1>🎮 СВОЯ ИГРА 🎮</h1>
        <p style={{ fontSize: "1.1em", color: "#ffd700" }}>
          {subtitle}
        </p>
      </div>

      <div className="scores">
        <div className="score-box">
          <h3>Команда 1</h3>
          <div className="score">{gameState.team1}</div>
        </div>
        <div className="score-box">
          <h3>Команда 2</h3>
          <div className="score">{gameState.team2}</div>
        </div>
        <div className="score-box">
          <h3>Ход</h3>
          <div className="score">Команда {gameState.currentTeam}</div>
        </div>
      </div>

      <div className="game-board">
        {categoryNames.map((cat) => (
          <div key={cat} className="category-column">
            <div className="category-header">{cat}</div>
            {categories[cat].map((q, i) => {
              const key = `${cat}-${i}`;
              const disabled = !!gameState.answeredQuestions[key];
              return (
                <button
                  key={key}
                  className="question-btn"
                  disabled={disabled}
                  onClick={() => openQuestion(cat, i)}
                >
                  {q.points}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button className="btn btn-neutral" onClick={resetGame}>
          🔄 Новая Игра
        </button>
      </div>

      {modal && (
        <QuestionModal
          modal={modal}
          onSelectAnswer={handleAnswer}
          onContinue={continueGame}
        />
      )}
    </div>
  );
};

interface QuestionModalProps {
  modal: ModalState;
  onSelectAnswer: (idx: number) => void;
  onContinue: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
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

  // phase === "result"
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

export default App;
