# Academic Grading Report

## Strengths

- Clear student finance theme with a realistic problem and audience.
- Semantic page structure with dashboard, records, form, settings, and about sections.
- Strong regex evidence through validation rules, duplicate-word detection, live regex search, and safe compilation.
- Modular JavaScript with separation between validation, search, stats, storage, state, and DOM orchestration.
- Good accessibility foundation: labels, skip link, focus styles, live regions, `aria-describedby`, and `aria-invalid`.
- Local persistence plus validated JSON import/export.
- Diverse `seed.json` data with currencies, categories, edge dates, and varied amounts.
- Browser-based tests provide evidence for validation, stats, conversion, cap logic, and import validation.

## Weaknesses Found Before Improvements

- Field errors were visible but invalid controls were not marked with `aria-invalid`.
- Settings validation silently replaced invalid exchange rates with defaults, which could mislead users.
- Code comments were too sparse to fully demonstrate student understanding.
- README was useful but did not include all requested academic sections.
- No dedicated `docs/` folder existed for design, testing, and accessibility evidence.
- Test documentation did not fully list edge cases, import/export checks, accessibility checks, or currency conversion checks.
- Record ID creation used a timestamp slice, which was less readable and could be harder to justify academically.

## Improvements Made

- Added accessible invalid-state handling for transaction and settings fields.
- Added explicit settings validation and clearer settings error messages.
- Added focus movement to the first invalid transaction field.
- Improved empty-state messaging for records.
- Added meaningful comments explaining validation, accessibility, state, storage, chart, search, and design choices.
- Replaced the README with a full professional submission README.
- Added `TESTING.md`.
- Added `docs/design-decisions.md`, `docs/testing-report.md`, and `docs/accessibility-report.md`.
- Added this grading report.
- Added tests for EUR conversion and unsupported import currency.
- Reworked new record IDs to use the next readable `txn_0001` style value.

## Risks That Could Lower Marks

- There is no framework-based or command-line test runner; tests are browser-based.
- There is no automated accessibility report from axe or Lighthouse.
- The mobile records layout uses horizontal table scrolling rather than a purpose-built card view.
- Browser `confirm()` is functional but less polished than a custom accessible dialog.
- Screenshots and demo video links still need to be added before final submission.

## Recommended Further Improvements

- Add screenshots to the README screenshots section.
- Record the required 2-3 minute demo video and add the link.
- Run Lighthouse or axe DevTools and save the results in `docs/`.
- Add a mobile card layout for records if time allows.
- Add CSV export as an optional enhancement.

## Estimated Academic Grade

Before improvements: 78-84%.

After improvements: 88-93%.

The project now reads as a strong student submission because it demonstrates implementation, validation reasoning, accessibility awareness, testing evidence, and reflective documentation without becoming unrealistically complex.
