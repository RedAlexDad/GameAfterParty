import type { FC } from "react";

interface GameHeaderProps {
  subtitle: string;
}

const GameHeader: FC<GameHeaderProps> = ({ subtitle }) => (
  <div className="header">
    <h1>🎮 СВОЯ ИГРА 🎮</h1>
    <p style={{ fontSize: "1.1em", color: "#ffd700" }}>{subtitle}</p>
  </div>
);

export default GameHeader;
