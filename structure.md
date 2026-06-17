
Summative Assignment - Building Responsive UI

Student Finance Tracker (budgets, transactions, search)

You’ll build an accessible, responsive, vanilla HTML/CSS/JS app that demonstrates: semantic structure, mobile-first layouts, DOM manipulation, events, regex validation & search, basic persistence, and clean modular code.

Learning Outcomes
Regex: Validate inputs and power search (incl. at least one advanced pattern such as lookahead/behind or back-reference).
HTML/CSS: Semantic layout with responsive design (Flexbox + media queries) and at least one tasteful animation/transition.
JavaScript: DOM updates, event handling, sorting/filtering, modular structure (ES modules or IIFE), and error handling.
Data: Save/load to localStorage; JSON import/export with validation.
Accessibility (a11y): Keyboard navigation, visible focus, ARIA live regions, and adequate color contrast.
Core Features (apply to any theme)

A) Pages/Sections
About: Purpose + your contact (GitHub, email).

Dashboard/Stats

Records Table (or cards on mobile)

Add/Edit Form

Settings


B) Data Model
Each record must include a unique id and timestamps:

{ id: "rec_0001", description: "Lunch at cafeteria", // or title amount: 12.50, // or duration/pages for other themes category: "Food", // or tag date: "2025-09-29", createdAt: "...", updatedAt: "..." }
Auto-save all changes to localStorage.

Import/Export JSON (validate structure before loading).


C) Forms & Regex Validation (min 4 rules)
Description/title: forbid leading/trailing spaces and collapse doubles (e.g., /^\S(?:.*\S)?$/)

Numeric field (amount/duration/pages): ^(0|[1-9]\d*)(\.\d{1,2})?$

Date (YYYY-MM-DD): ^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$

Category/tag (letters, spaces, hyphens): /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/

Advanced regex (≥1): e.g., back-reference to catch duplicate words \b(\w+)\s+\1\b, or lookahead for password/rate strength.


D) Table, Sorting, and Regex Search
Render all records; allow sort by date, description/title (A↕Z), and numeric field (↑↓).

Live regex search:

User types a pattern; compile with try/catch; toggle case-insensitive.

Highlight matches using <mark> without breaking accessibility.


E) Stats Dashboard
Minimum: total records, sum of numeric field, top category/tag, last-7-days trend (simple CSS/JS chart).

Cap/Target: Set a numeric cap; show remaining/overage in an ARIA live message (polite when under, assertive when exceeded).


F) Units/Currency
Finance Tracker: Base currency + 2 others. Manual rates in Settings (no API).

Planner/Vault: Define units (minutes/pages) and allow basic conversions (e.g., minutes↔hours).


G) Edit & Delete
Inline edit per row; confirm delete; update state, UI, stats, and updatedAt.


H) Accessibility & UX
Semantic landmarks (header, nav, main, section, footer) and proper headings.

Labels bound to inputs; visible focus styles; skip-to-content link.

Status/errors announced via role="status" or aria-live.

Keyboard-only flow must work.

Mobile-first responsive design (≥3 breakpoints: ~360px, 768px, 1024px).

Theme-Specific Notes
1) Student Finance Tracker

Default categories: Food, Books, Transport, Entertainment, Fees, Other (editable).

Example search patterns:

Cents present: /\.\d{2}\b/

Beverage keyword: /(coffee|tea)/i

Duplicate word: /\b(\w+)\s+\1\b/

2) Campus Life Planner

Records include title, dueDate, duration, tag.

Regex ideas: ^@tag:\w+ to filter; \b\d{2}:\d{2}\b to find time tokens.

3) Book & Notes Vault

Records include title, author, pages, tag, dateAdded.

Regex ideas: extract ISBN; detect repeated author surnames via back-refs.

File Structure & Constraints
No frameworks (no Bootstrap/React/etc.). Optional jQuery only on an extra scraping page (Stretch).

Suggested folders:
index.html, styles/, scripts/, assets/, tests.html, seed.json

Suggested modules:
scripts/storage.js, state.js, ui.js, validators.js, search.js

Milestones & Weighting (Total 100%)
M1 – Spec & Wireframes (10%): sketches, data model, a11y plan
M2 – Semantic HTML & Base CSS (10%): sections present, mobile-first layout
M3 – Forms & Regex Validation (15%): 4+ rules incl. one advanced; clear error UI; tests.html with small assertions
M4 – Render + Sort + Regex Search (20%): table/cards, sorting, safe regex compiler, highlight matches
M5 – Stats + Cap/Targets (15%): dashboard metrics, cap logic, ARIA live updates
M6 – Persistence + Import/Export + Settings (15%): localStorage; JSON round-trip with validation; currency/units settings
M7 – Polish & A11y Audit (15%): keyboard pass, animation, README, 2–3 min demo video
Submission
Repo URL with GitHub Pages URL in the README (Netlify, Heroku, Render, etc are not allowed and you won't be graded if you deploy there)
README.md with: chosen theme, features list, regex catalog (patterns + examples), keyboard map, a11y notes, and how to run tests.
Demo video (unlisted link) showing keyboard navigation, regex edge cases, and import/export.
seed.json with ≥10 diverse records (edge dates, large/small numbers, tricky strings).
TAKE NOTE!
Individual Work: You must confirm that your GitHub account is the only contributor to the repository. No other users should appear in the contribution history.
Milestones (M1-M7): Use the milestones as a development roadmap; your commit history should reflect this progress 
Starter Snippets (optional)
Safe regex compiler

export function compileRegex(input, flags='i') { try { return input ? new RegExp(input, flags) : null; } catch { return null; } }
Highlight matches

export function highlight(text, re) { if (!re) return text; return text.replace(re, m => `<mark>${m}</mark>`); }
Persistent state

const KEY = 'app:data'; export const load = () => JSON.parse(localStorage.getItem(KEY) || '[]'); export const save = data => localStorage.setItem(KEY, JSON.stringify(data));
Seed (Finance example)

[ {"id":"txn_1","description":"Lunch at cafeteria","amount":12.50,"category":"Food","date":"2025-09-25","createdAt":"...","updatedAt":"..."}, {"id":"txn_2","description":"Chemistry textbook","amount":89.99,"category":"Books","date":"2025-09-23","createdAt":"...","updatedAt":"..."}, {"id":"txn_3","description":"Bus pass","amount":45.00,"category":"Transport","date":"2025-09-20","createdAt":"...","updatedAt":"..."}, {"id":"txn_4","description":"Coffee with friends","amount":8.75,"category":"Entertainment","date":"2025-09-28","createdAt":"...","updatedAt":"..."} ]

Stretch (Optional features you can include)
Offline-first (service worker caching)
Light/Dark theme toggle (persisted)
CSV export (properly escaped)
Mini jQuery scraping page: parse a provided static HTML snippet with selectors and output JSON
Academic Integrity
Your UI/logic must be your own. Cite any external snippets or accessibility checklists you adapt.
