# Testing Checklist

## Automated Browser Tests

Open:

```text
http://localhost/summative/tests.html
```

Expected result: all tests should pass.

## Validation Test Cases

| Area | Input | Expected Result |
|---|---|---|
| Description | `Lunch at cafeteria` | Accepted |
| Description | ` Lunch` | Rejected for leading space |
| Description | `coffee coffee` | Rejected by duplicate-word back-reference |
| Amount | `2500` | Accepted |
| Amount | `12.50` | Accepted |
| Amount | `012` | Rejected |
| Amount | `12.500` | Rejected |
| Date | `2026-06-17` | Accepted |
| Date | `2025-02-31` | Rejected as impossible date |
| Category | `School Fees` | Accepted |
| Category | `Food123` | Rejected |

## Edge Cases

- Empty form submission should show field-level messages and focus the first invalid field.
- Zero amount should be accepted only when it matches the numeric format.
- Very large amounts should render without breaking the table or dashboard cards.
- Leap day date `2024-02-29` should be accepted.
- Invalid settings values such as `0`, `abc`, or negative rates should not be saved.
- Spending cap can be empty, zero, or a positive number.

## Import And Export Tests

- Export should download `student-finance-tracker-backup.json`.
- Exported JSON should include `app`, `version`, `exportedAt`, `settings`, and `records`.
- Importing `seed.json` should replace the records and update dashboard totals.
- Import should reject malformed JSON.
- Import should reject duplicate IDs.
- Import should reject unsupported currencies such as `GBP`.
- Import should reject records with invalid dates, categories, descriptions, amounts, or timestamps.

## Search Tests

- Search `coffee|tea` should match beverage descriptions.
- Search `Food|Transport` should match categories.
- Search `\.\d{2}\b` should match values with two decimal places.
- Search `[coffee` should show an invalid regex message without breaking the page.
- Case-insensitive toggle should change matching behavior.
- Highlighted matches should appear with `<mark>` and should not inject HTML.

## Currency Conversion Tests

- RWF records should keep the same value in dashboard totals.
- USD records should multiply by the manual USD rate.
- EUR records should multiply by the manual EUR rate.
- Changing rates should update total spent, top category, cap status, and chart summary.
- Invalid rates should show errors and prevent misleading recalculation.

## Accessibility Checks

- Keyboard can reach nav links, form fields, settings, search controls, sort, and table action buttons.
- Skip link appears on focus and moves focus to the main content area.
- Focus indicators are visible on interactive controls.
- Field errors are connected with `aria-describedby`.
- Invalid controls update `aria-invalid`.
- Status messages announce form, settings, import, export, and cap feedback.
- Reduced-motion preference disables smooth transitions.
- Table has a caption and column headings.
- Chart information is available in text, not only visually.
