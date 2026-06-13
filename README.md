# Lyrics Teleprompter App

Full-stack lyrics teleprompter with a Node/Express/MongoDB backend and a Next.js frontend.

## Environment variables

Create a backend `.env` file with the following values:

```env
MONGO_URI=mongodb://localhost:27017/lyrics-teleprompter
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
GROQ_API_KEY=replace-if-using-ai-sync
OPENAI_API_KEY=replace-if-using-openai-compatible-ai-sync
```

- `MONGO_URI` is required for MongoDB/Mongoose persistence.
- `JWT_SECRET` is required for login-protected APIs.
- `JWT_EXPIRES_IN` is optional and defaults to `7d`.
- `GROQ_API_KEY` or `OPENAI_API_KEY` is required only for audio auto-sync.
