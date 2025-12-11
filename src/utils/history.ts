import type { ScoreSnapshot } from "../types";
import { HISTORY_ENDPOINT } from "../constants";

export const sendHistoryToServer = async (history: ScoreSnapshot[]) => {
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
