import { useMemo, useState } from "react";
import { categories } from "../data";
import type {
  CategoryKey,
  GameState,
  ModalState,
  ScoreSnapshot,
  TeamId,
} from "../types";
import { sendHistoryToServer } from "../utils/history";

const initialState: GameState = {
  team1: 0,
  team2: 0,
  currentTeam: 1,
  answeredQuestions: {},
  gameOver: false,
  history: [],
};

export const useGame = () => {
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
    } else {
      setModal(null);
    }
  };

  const resetGame = () => {
    setGameState(initialState);
    localStorage.removeItem("svoya-igra-history");
    setModal(null);
  };

  return {
    gameState,
    modal,
    categoryNames,
    subtitle,
    openQuestion,
    handleAnswer,
    continueGame,
    resetGame,
  };
};
