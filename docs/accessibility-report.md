# Accessibility Report

## Summary

The project uses semantic HTML, native controls, visible focus styles, live feedback, and responsive layout. The accessibility implementation is appropriate for a student finance application and avoids unnecessary ARIA where native HTML is enough.

## ARIA Usage

- `aria-label` names the navigation and summary groups.
- `aria-labelledby` connects sections to visible headings.
- `aria-describedby` connects form controls to hints and errors.
- `aria-invalid` updates when validation fails.
- `role="status"` and `aria-live` announce form, settings, import, export, and budget updates.
- The chart uses `aria-hidden="true"` because a text summary provides the same information.

## Keyboard Navigation

Keyboard users can tab through navigation, transaction fields, settings fields, import/export controls, search, sort, and table action buttons. Native buttons, inputs, selects, and links are used to avoid custom keyboard handling.

## Focus States

The CSS uses `:focus-visible` with a high-contrast outline. Invalid fields also receive a warning border so users can identify errors after validation.

## Skip Link

The skip link appears when focused and jumps to `#main-content`, reducing repeated navigation for keyboard and screen-reader users.

## Reduced Motion

The stylesheet includes a `prefers-reduced-motion: reduce` media query that removes smooth scrolling, transitions, and animations for users who request less motion.

## Form Validation Accessibility

Validation messages are shown next to the relevant field and announced through polite live regions. On failed transaction submission, focus moves to the first invalid field. Settings validation prevents silent fallbacks that could mislead users about financial totals.

## Remaining Improvements

- Add an accessible custom dialog for delete confirmation.
- Add automated axe or Lighthouse accessibility evidence.
- Consider a mobile card alternative for records while preserving table semantics for wider screens.
- Add screenshots showing keyboard focus and validation states.
