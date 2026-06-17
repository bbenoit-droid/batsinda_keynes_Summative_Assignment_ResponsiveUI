# Student Finance Tracker

## Project Overview

Student Finance Tracker is a responsive vanilla HTML, CSS, and JavaScript application for recording student expenses, reviewing spending patterns, and checking a personal spending cap. It uses RWF as the base currency and supports USD and EUR through manual exchange rates.

## Problem Statement

Students often spend small amounts across food, transport, books, fees, and social activities. Without a simple record, it becomes difficult to see where money is going or whether spending is still within a safe limit. This project solves that problem with quick transaction entry, searchable records, clear dashboard summaries, and local backup options.

## Features

- Add, edit, and delete finance transactions.
- Sort records by date, description, or amount.
- Live regex search with invalid-pattern feedback.
- Highlight search matches using semantic `<mark>` elements.
- Dashboard showing total records, total spent, top category, cap status, and last-7-days trend.
- Spending cap feedback through ARIA live regions.
- RWF totals with manual USD and EUR conversion rates.
- Auto-save to `localStorage`.
- Validated JSON import and JSON export.
- Mobile-first responsive layout with breakpoints around 360px, 768px, and 1024px.
- Keyboard-accessible controls, skip link, visible focus styles, and reduced-motion support.

## Technologies Used

- HTML5 semantic landmarks and forms.
- CSS custom properties, Grid, Flexbox, media queries, and `prefers-reduced-motion`.
- Vanilla JavaScript ES modules.
- Browser APIs: DOM, `localStorage`, `FileReader`, `Blob`, and `URL.createObjectURL`.

## Installation Instructions

1. Clone or download the repository.
2. Place the project folder in the XAMPP `htdocs` directory.
3. Start Apache from XAMPP.
4. Open:

```text
http://localhost/summative/index.html
```

The app can also be opened directly from `index.html`, but a local server is recommended because the project uses ES modules.

## Usage Instructions

1. Use the transaction form to add a description, amount, currency, category, and date.
2. Use Edit or Delete in the table to manage existing records.
3. Use the regex search field to filter records, for example `coffee|tea` or `\.\d{2}\b`.
4. Use the sort menu to reorder records.
5. Set USD and EUR rates in Settings so mixed-currency totals convert to RWF.
6. Set a spending cap to receive remaining or over-budget feedback.
7. Export JSON to create a backup.
8. Import `seed.json` or another validated backup to restore records.

## Accessibility Considerations

- Semantic landmarks are used: `header`, `nav`, `main`, `section`, `aside`, and `footer`.
- The skip link lets keyboard users jump directly to main content.
- Every form control has a visible label.
- Error and hint text is connected through `aria-describedby`.
- Invalid fields update `aria-invalid`.
- Form, settings, search, and budget messages use live regions.
- The cap message becomes assertive only when the user exceeds the cap.
- Focus states use a high-contrast outline.
- The chart is hidden from assistive technology because the adjacent text summary communicates the same values.
- Motion is reduced for users who prefer reduced motion.

## Design Decisions

- Vanilla HTML, CSS, and JavaScript were used to match the assignment and demonstrate core front-end understanding.
- RWF is the base currency because the app is aimed at a Rwanda-based student context.
- Manual currency rates were chosen instead of an API so the app stays client-side and works offline after loading.
- Regex search is included because it is an assignment requirement and is useful for power users who want flexible filtering.
- JSON import/export belongs in the app because students may change browsers or devices and need a simple backup method.
- The last-7-days chart is intentionally simple so it supports review without adding enterprise-level reporting complexity.
- Browser `confirm()` is used for delete confirmation to keep the implementation realistic for a student project.

## Testing Strategy

Testing is documented in [TESTING.md](TESTING.md) and [docs/testing-report.md](docs/testing-report.md). The browser test runner is available at:

```text
http://localhost/summative/tests.html
```

The tests cover validation rules, regex search compilation, currency conversion, cap logic, trend output, and import validation. Manual testing covers keyboard navigation, responsive layout, import/export workflow, and accessibility checks.

## Screenshots

Add screenshots before final submission:

- `docs/screenshots/dashboard-desktop.png`
- `docs/screenshots/form-validation.png`
- `docs/screenshots/mobile-records.png`
- `docs/screenshots/import-export.png`

## Future Improvements

- Add a mobile card view for records instead of relying only on horizontal table scrolling.
- Replace browser `confirm()` with an accessible custom confirmation dialog.
- Add optional CSV export.
- Add a user-controlled dark theme.
- Add automated browser accessibility checks with a tool such as axe DevTools.

## Links

- GitHub repository: `https://github.com/bbenoit-droid/summative`
- GitHub Pages: `https://bbenoit-droid.github.io/summative/`
- Demo video: add the unlisted video link after recording.

## Individual Work Confirmation

This project is intended as individual work. Before submission, confirm that the repository contribution history shows only the student GitHub account.
