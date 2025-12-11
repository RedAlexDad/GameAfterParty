export type TeamId = 1 | 2;

export interface Question {
  points: number;
  question: string;
  correct: number;
  options: string[];
  image?: string | string[];
}

export type CategoryKey =
  | "👾 ЛОГИКА"
  | "🎓 МГТУ им. Баумана"
  | "🤔 НЕОЧЕВИДНЫЕ ВОПРОСЫ"
  | "🎬 КИНО";

export type Categories = Record<CategoryKey, Question[]>;

export interface ScoreSnapshot {
  time: string;
  team1: number;
  team2: number;
  currentTeam: TeamId;
  questionKey: string;
  points: number;
  correct: boolean;
}

export interface GameState {
  team1: number;
  team2: number;
  currentTeam: TeamId;
  answeredQuestions: Record<string, boolean>;
  gameOver: boolean;
  history: ScoreSnapshot[];
}

export type ModalState = {
  category: CategoryKey;
  index: number;
  phase: "question" | "result";
  isCorrect?: boolean;
  points?: number;
  selectedIdx?: number;
} | null;
