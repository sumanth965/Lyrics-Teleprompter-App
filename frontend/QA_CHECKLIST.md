# QA Checklist

- [ ] Route coverage: `/`, `/library`, `/studio`, `/player`, `/player?songId=<id>`.
- [ ] Navigation CTAs open expected pages and no `href="#"` placeholders remain.
- [ ] Song search filters by title and artist.
- [ ] Player controls: play/pause, restart, seek, speed.
- [ ] Keyboard: tab traversal visible focus, Space toggles playback, ArrowUp/ArrowDown adjusts speed.
- [ ] Accessibility: semantic landmarks present, icon-only controls have `aria-label`.
- [ ] Responsive behavior verified at mobile, tablet, desktop breakpoints.
