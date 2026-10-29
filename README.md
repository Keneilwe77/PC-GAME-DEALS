# Pixel Deals — Practical Exercise

## Files
- `deals.json`: the eight records supplied in the brief.
- `index.html`, `styles.css`, `app.js`: browser application.
- `part_a.py`: standalone Part A solution in Python.
- `PART_D.md`: write-up draft; edit it so it accurately reflects your own work.

## Run the web page
The app loads `deals.json` using `fetch`, so use a local server instead of opening `index.html` directly.

1. Open a terminal in this folder.
2. Run `python -m http.server 8000` (Windows alternative: `py -m http.server 8000`).
3. Visit `http://localhost:8000` in your browser.
4. Press Ctrl+C in the terminal to stop the server.

No packages or build step are required.

## Run Part A
Run `python part_a.py`. Expected results include:
- Six games are on sale: Hollow Knight, Celeste, Hades, Portal 2, Disco Elysium and Cuphead.
- Hollow Knight discount: 50%.
- Cheapest game: Portal 2 at R0.99.
- Search `hol` returns Hollow Knight.

## Included stretch goals
The page has live title search, a sale-only checkbox, sorting, responsive styling and loading/error feedback. It uses the supplied dataset rather than the optional live API so results are reproducible.
