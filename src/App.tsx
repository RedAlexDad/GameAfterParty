import React from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import GameHeader from "./components/GameHeader";
import QuestionModal from "./components/QuestionModal";
import Scores from "./components/Scores";
import { useGame } from "./hooks/useGame";

const App: React.FC = () => {
  const {
    gameState,
    modal,
    categoryNames,
    subtitle,
    openQuestion,
    handleAnswer,
    continueGame,
    resetGame,
  } = useGame();

  return (
    <div className="game-container">
      <GameHeader subtitle={subtitle} />

      <Scores
        team1={gameState.team1}
        team2={gameState.team2}
        currentTeam={gameState.currentTeam}
      />

      <GameBoard
        categoryNames={categoryNames}
        answeredQuestions={gameState.answeredQuestions}
        onOpenQuestion={openQuestion}
      />

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button className="btn btn-neutral" onClick={resetGame}>
          🔄 Новая Игра
        </button>
      </div>

      <QuestionModal
        modal={modal}
        onSelectAnswer={handleAnswer}
        onContinue={continueGame}
      />
    </div>
  );
};

export default App;
