import type { FC } from "react";
import { categories } from "../data";
import type { CategoryKey } from "../types";

interface GameBoardProps {
  categoryNames: CategoryKey[];
  answeredQuestions: Record<string, boolean>;
  onOpenQuestion: (category: CategoryKey, index: number) => void;
}

const GameBoard: FC<GameBoardProps> = ({
  categoryNames,
  answeredQuestions,
  onOpenQuestion,
}) => (
  <div className="game-board">
    {categoryNames.map((cat) => (
      <div key={cat} className="category-column">
        <div className="category-header">{cat}</div>
        {categories[cat].map((q, i) => {
          const key = `${cat}-${i}`;
          const disabled = !!answeredQuestions[key];
          return (
            <button
              key={key}
              className="question-btn"
              disabled={disabled}
              onClick={() => onOpenQuestion(cat, i)}
            >
              {q.points}
            </button>
          );
        })}
      </div>
    ))}
  </div>
);

export default GameBoard;
