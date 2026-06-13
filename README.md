What you should improve
Add user authentication and protect song/settings APIs.

Make songs and settings user-specific instead of global.

Add setlists with drag-and-drop song ordering.

Add real library filters for:

Has audio

Missing audio

Recently added

Artist

Title

Improve the lyric editor with:

LRC validation

Timestamp editing

Preview mode

Bulk sync offset adjustment

Line-by-line timing controls

Add manual lyric timing while audio plays, like “tap to timestamp.”

Add waveform display for easier lyric syncing.

Improve AI sync with:

Progress indicator

Background job handling

Better provider configuration

Retry/error states

Clarify AI provider settings instead of always using Groq’s base URL.

Add OpenAI/Groq provider selection through environment variables.

Add better loading and error states in the frontend.

Replace browser alert() messages with proper toast notifications or modals.

Add confirmation dialogs before deleting songs or audio.

Fix or remove placeholder authentication files.

Add production-safe CORS configuration.

Split health checks into:

Liveness check

Readiness/database check

Add offline/PWA support for stage use.

Cache lyrics, settings, and audio for offline performances.

Add multi-device sync if you want conductor/follower stage mode.

Add keyboard shortcut help inside the player.

Add foot pedal, MIDI, or Bluetooth controller support.

Make landing page buttons actually navigate to Studio or Library.

Improve audio upload handling with unique filenames to avoid browser caching issues.

Store audio metadata such as duration, file size, MIME type, and original filename.

Add cloud storage support for uploaded audio instead of local filesystem only.

Add tests for lyric parsing, sync timing, API routes, and player behavior.

Add end-to-end tests for Studio → Library → Player workflows.

Add better mobile/tablet layouts for real performance use.

Add dark/light/high-contrast stage themes.

Add per-song display settings like font size, scroll speed, and sync offset.

Add song notes, key, BPM, capo, chords, and arrangement metadata.

Add version history for lyrics.

Add export/import for songs or setlists.

Add backup and restore functionality.

Add admin tools for managing the song database.

Add more robust validation on backend inputs.

Add rate limiting and file upload security checks.

Add cleanup tools for orphaned uploaded audio files.

Add logging/monitoring for production debugging.
