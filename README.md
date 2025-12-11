# GameAfterParty

Игра «Вечеринка» на React + TypeScript + Vite.

## Запуск

```bash
npm install
npm run dev
```

Фронт по умолчанию поднимается на `http://localhost:5173`.

## История очков в файл

Добавлен простой backend на Express для сохранения истории ответов в `public/history.json`.

### Как запустить сервер

```bash
npm run server
```

Сервер слушает `http://localhost:4000`. При старте создаёт `public/history.json`, если его нет.

### Как работает запись

- После каждого ответа фронт отправляет POST на `http://localhost:4000/history` с телом `{ history }`, где `history` — массив `ScoreSnapshot` из `src/types.ts`.
- Сервер перезаписывает `public/history.json` следующим объектом:
  ```json
  {
    "description": "История очков команд. Формат элементов соответствует ScoreSnapshot из src/types.ts.",
    "history": [ ... ]
  }
  ```
- CORS открыт на `*` для локальной разработки.

### Одновременный запуск фронта и сервера

В двух окнах/сессиях:

```bash
npm run server      # backend на 4000
npm run dev         # фронт на 5173
```

## Примечания

- Клиент по-прежнему хранит историю в `localStorage` под ключом `svoya-igra-history`.
- Для другого порта/пути правьте `HISTORY_ENDPOINT` в `src/App.tsx` и `PORT` в `server.js`.
