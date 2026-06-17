# M7 Accessibility and Polish Audit

## What I Checked

- Semantic page structure is present: `header`, `nav`, `main`, `section`, `aside`, and `footer`.
- The skip link appears on focus and jumps to `main`.
- Form fields have visible labels.
- Error/status messages use live regions where users need feedback.
- Keyboard users can reach navigation, form inputs, settings, search controls, and table action buttons.
- Focus styles are visible through `:focus-visible`.
- The dashboard cap message becomes assertive when spending is over the cap.
- The chart has a text summary so the information is not only visual.
- Motion is reduced for users who prefer reduced motion.
- The app uses mobile-first CSS with breakpoints at 360px, 768px, and 1024px.

## Areas I Would Improve With More Time

- Add a more visual mobile card layout for records instead of relying mainly on horizontal table scrolling.
- Add a user-controlled dark theme and save the preference.
- Add a clearer confirmation modal instead of using the browser `confirm()` dialog.
- Run a full automated accessibility check in the browser before final submission.

## Reflection

The strongest accessibility choices are the labelled form controls, live feedback messages, visible focus styles, and keyboard-friendly controls. These choices matter because the app handles finance records, so users need clear feedback when data is accepted, rejected, imported, exported, or over budget.
