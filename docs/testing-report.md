# Testing Report

## Test Approach

Testing combines automated browser assertions in `tests.html` with manual checks documented in `TESTING.md`. This is realistic for a vanilla student project because it verifies the important logic without adding a framework that the assignment does not require.

## Automated Tests Covered

- Description validation.
- Duplicate-word back-reference validation.
- Amount validation.
- Date format and real calendar date validation.
- Category validation.
- Full transaction validation.
- Safe regex search compilation.
- USD and EUR currency conversion.
- Spending cap overage logic.
- Last-7-days trend output length.
- Valid import data.
- Duplicate import IDs.
- Unsupported import currencies.

## Manual Tests Covered

- Keyboard navigation from skip link to the main app.
- Form submission with empty and invalid fields.
- Add, edit, delete, and reset workflows.
- Search highlighting and invalid regex feedback.
- Sort controls.
- Settings validation.
- JSON export download.
- JSON import using `seed.json`.
- Mobile layout at small, medium, and desktop widths.
- Reduced motion behavior.

## Known Gaps

- There is no automated end-to-end test runner.
- There is no automated accessibility scanner in the repository.
- Delete confirmation uses the browser `confirm()` dialog instead of a custom tested modal.
- Visual regression testing is manual.

## Risk Assessment

The highest testing risk is import/export because it handles user-supplied files. This is reduced by strict validation before records are replaced. The next risk is currency conversion because totals depend on settings; this is reduced by explicit settings validation and automated conversion tests.
