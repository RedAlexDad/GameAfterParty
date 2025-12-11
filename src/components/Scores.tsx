import type { FC } from "react";
import type { TeamId } from "../types";

interface ScoresProps {
  team1: number;
  team2: number;
  currentTeam: TeamId;
}

const Scores: FC<ScoresProps> = ({ team1, team2, currentTeam }) => (
  <div className="scores">
    <div className="score-box">
      <h3>Команда 1</h3>
      <div className="score">{team1}</div>
    </div>
    <div className="score-box">
      <h3>Команда 2</h3>
      <div className="score">{team2}</div>
    </div>
    <div className="score-box">
      <h3>Ход</h3>
      <div className="score">Команда {currentTeam}</div>
    </div>
  </div>
);

export default Scores;
