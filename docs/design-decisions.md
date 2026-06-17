# Design Decisions

## Project Scope

The project stays intentionally small: one HTML page, one CSS file, modular JavaScript, a browser test page, and JSON seed data. This is appropriate for a student finance tracker because the main goal is to demonstrate front-end fundamentals, not to build a banking product.

## Feature Justification

| Feature | Belongs In App? | Justification |
|---|---|---|
| Add, edit, delete transactions | Yes | Core finance tracking requires users to maintain their own records. |
| Categories | Yes | Categories help students understand spending patterns. |
| Dashboard totals | Yes | Totals and top category give quick feedback without requiring spreadsheet skills. |
| Spending cap | Yes | A cap directly supports budgeting and helps users notice overspending. |
| Last-7-days chart | Yes | Recent spending is useful for weekly student budget review. |
| Regex search | Yes, with explanation | Regex is more advanced than many student users need, but it is required by the assignment and demonstrates flexible search. |
| Sort controls | Yes | Sorting helps users review records by time, amount, or description. |
| Manual currency conversion | Yes | Students may pay in RWF, USD, or EUR; manual rates keep the app offline and simple. |
| JSON import/export | Yes | Students need backups when changing browsers or devices. |
| Contact details in About | Yes | Required by the project brief and useful for submission identity. |

No feature was removed because each one either supports a finance workflow or satisfies a stated assignment requirement.

## Structure

- `index.html` contains semantic structure and accessible form markup.
- `styles/main.css` contains visual design, responsive layout, and accessibility-related styles.
- `scripts/validators.js` owns regex and form validation.
- `scripts/search.js` owns regex compilation and safe highlighting.
- `scripts/stats.js` owns totals, currency conversion, cap logic, and chart data.
- `scripts/storage.js` owns localStorage, export, and import validation.
- `scripts/state.js` owns application state and record mutation helpers.
- `scripts/app.js` connects DOM events, rendering, validation, state, and storage.
- `tests.html` provides lightweight browser-based assertions.
- `seed.json` provides diverse import data for testing.

## Accessibility Decisions

The app uses native controls wherever possible because they provide reliable keyboard and assistive technology behavior. ARIA is used only where it adds information: live regions, `aria-describedby`, `aria-invalid`, and labelled navigation.

The chart is marked `aria-hidden` because the text summary next to it communicates the same information more clearly to screen-reader users.

## UX Decisions

The interface avoids advanced financial terminology. Error messages are short and direct. The table remains a table on mobile so column headings and relationships remain clear, with horizontal scrolling used as a practical student-level solution.

## Maintainability Decisions

Each module has one responsibility. The app avoids frameworks because the assignment asks for vanilla front-end work and because modular ES files already provide enough organization for this project size.
