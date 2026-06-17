# M1 Specification and Wireframes

## Project Title

Student Finance Tracker

## Chosen Theme

I chose the **Student Finance Tracker** theme because managing small daily expenses is a realistic problem for students. Students often spend money on food, transport, books, entertainment, and fees, but they may not always notice how quickly these costs add up. I wanted the app to focus on quick entry, clear totals, and easy searching, rather than making the interface too complex.

My main design goal is to make the tracker usable on a phone first, since students are more likely to add expenses immediately after spending money. At the same time, the app should still work well on larger screens when a student wants to review spending patterns in more detail.

## Purpose of the App

The purpose of the Student Finance Tracker is to help students record, search, sort, and review their expenses. The app will let users add spending records, edit or delete them, search using regular expressions, and see useful statistics such as total spending, top category, and whether they are under or over a spending cap.

The app will store data in the browser using `localStorage`, so the student can close the page and return later without losing their records. It will also support JSON import and export so the user can back up their data or reload sample data.

## Intended User

The intended user is a student who wants a simple way to track everyday spending. This user may need to enter expenses quickly on a phone, but may also want to review records on a laptop. Some students use RWF for local payments, while international students may also carry or think in USD or EUR. For this reason, the app will use RWF as the base currency and include USD and EUR as additional currencies with manual exchange rates.

This choice also makes the settings section more meaningful because the exchange rate is not coming from an API. The user has to enter the rate manually, which matches the assignment constraint and keeps the app fully client-side.

## Contact Information for About Section

- GitHub: `bbenoit-droid`
- Email: `b.benoit@alustudent.com`
- Telephone: `+250786101724`

## Core Sections

### 1. About

The About section will explain what the app does and include my contact information. It will help the user understand that the app is designed for student budgeting and simple expense tracking, not for complex accounting.

### 2. Dashboard / Stats

The dashboard will show quick financial summaries:

- Total number of transactions
- Total amount spent
- Top spending category
- Spending in the last 7 days
- Budget cap status, showing whether the user is under or over the cap

This section is important because it turns the records into useful information, not just a list of expenses. It should help the student quickly answer questions such as, "How much have I spent?" and "Which category is taking most of my money?"

### 3. Records

The records section will display all transactions. On larger screens, this will work as a table. On smaller screens, the layout may become more card-like so each transaction is easier to read on a phone.

The user will be able to:

- Sort by date
- Sort by description
- Sort by amount
- Search records using regex
- Toggle case-insensitive search
- Edit a record
- Delete a record after confirmation

### 4. Add / Edit Form

The form will allow users to add new expenses or edit existing ones. It will include validation so that the data stays clean and predictable before it is saved.

Fields:

- Description
- Amount
- Category
- Date

### 5. Settings

The settings section will allow the user to manage:

- Base currency: RWF
- Additional currencies: USD and EUR
- Manual exchange rates
- Spending cap
- Import JSON
- Export JSON

## Data Model

Each transaction record will follow this structure:

```js
{
  id: "txn_0001",
  description: "Lunch at cafeteria",
  amount: 2500,
  category: "Food",
  date: "2025-09-29",
  createdAt: "2025-09-29T10:15:00.000Z",
  updatedAt: "2025-09-29T10:15:00.000Z"
}
```

### Field Explanation

- `id`: A unique transaction ID used to find a record when editing or deleting it.
- `description`: A short explanation of the expense.
- `amount`: The amount spent, stored as a number so totals and comparisons can be calculated.
- `category`: The type of spending, such as Food, Books, Transport, Entertainment, Fees, or Other.
- `date`: The date of the expense in `YYYY-MM-DD` format.
- `createdAt`: The timestamp showing when the record was created.
- `updatedAt`: The timestamp showing when the record was last changed.

Keeping both `createdAt` and `updatedAt` is useful because the app needs to show that edits change the record without losing the original creation history.

## Default Categories

The default categories will be:

- Food
- Books
- Transport
- Entertainment
- Fees
- Other

These categories match common student expenses and make the dashboard easier to understand. I will still keep "Other" for expenses that do not fit neatly into the main categories.

## Validation Plan

The form will use regex validation to reduce mistakes before records are saved. I will also trim and normalize some input, such as collapsing repeated spaces in descriptions, so that the stored data is easier to search and sort.

| Field | Pattern | Purpose | Example Valid Input | Example Invalid Input |
|---|---|---|---|---|
| Description | `/^\S(?:.*\S)?$/` | Prevents leading and trailing spaces | `Lunch at cafeteria` | ` Lunch` |
| Amount | `/^(0|[1-9]\d*)(\.\d{1,2})?$/` | Allows whole numbers or decimals with up to two places | `2500`, `12.50` | `012`, `5.999` |
| Date | `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` | Checks the `YYYY-MM-DD` format | `2025-09-29` | `29-09-2025` |
| Category | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Allows letters, spaces, and hyphens | `Transport`, `School Fees` | `Food123` |
| Duplicate words | `/\b(\w+)\s+\1\b/i` | Uses a back-reference to detect repeated words | `coffee with friends` | `coffee coffee` |

The duplicate word pattern is the advanced regex rule because it uses a back-reference. This helps catch typing mistakes in descriptions, for example when a user accidentally types `coffee coffee`.

## Search Plan

The records section will include live regex search. The user will type a regex pattern, and the app will try to compile it safely using `try/catch`. If the pattern is invalid, the app will show a helpful error instead of breaking the page.

Examples of useful searches:

- `coffee|tea` to find beverage-related spending
- `\.\d{2}\b` to find amounts written with cents
- `\b(\w+)\s+\1\b` to detect repeated words
- `Food|Transport` to find common daily spending categories

Matches will be highlighted with `<mark>` so they are easy to see. I will make sure the original text is handled safely before highlighting, because search highlighting should not create unsafe HTML.

## Accessibility Plan

Accessibility is important because the app should be usable by keyboard users and screen reader users, not only mouse users. Since this is a finance tracker, error messages and status updates also need to be clear so users do not save incorrect amounts by mistake.

Planned accessibility features:

- Use semantic landmarks: `header`, `nav`, `main`, `section`, and `footer`
- Add a skip-to-content link
- Use proper heading order
- Connect every label to its input
- Provide visible focus styles
- Make all buttons keyboard accessible
- Use `aria-live` or `role="status"` for form messages and budget cap updates
- Use clear error messages near the related input
- Keep color contrast readable
- Avoid relying only on color to communicate errors or warnings

The spending cap message will use polite announcements when the user is under the cap and stronger announcements when the cap is exceeded. This supports the requirement for ARIA live regions and also makes the budget warning more noticeable.

## Responsive Design Plan

The app will be designed mobile-first. This means the small-screen layout will be created first, then expanded for tablets and desktops.

Planned breakpoints:

- Around `360px` for small phones
- Around `768px` for tablets
- Around `1024px` for laptops and desktops

Mobile layout:

- Single-column sections
- Large enough form controls for touch input
- Records displayed in a stacked format so the table does not become too crowded

Tablet layout:

- More space between sections
- Dashboard stats can appear in a grid
- Records become easier to compare

Desktop layout:

- Wider records table
- Dashboard and settings can use more horizontal space
- Navigation and content can be easier to scan

## Basic Wireframes

### Mobile Wireframe

```text
+--------------------------------+
| Skip link                      |
| Header: Student Finance Tracker|
| Nav links                      |
+--------------------------------+
| Dashboard                      |
| Total spent                    |
| Top category                   |
| Cap status                     |
| 7-day mini chart               |
+--------------------------------+
| Add/Edit Form                  |
| Description                    |
| Amount                         |
| Category                       |
| Date                           |
| Save button                    |
+--------------------------------+
| Search and Sort Controls       |
+--------------------------------+
| Transaction Card               |
| Description, amount, category  |
| Edit / Delete                  |
+--------------------------------+
| Settings                       |
| Currency, rate, cap            |
| Import / Export                |
+--------------------------------+
| Footer                         |
+--------------------------------+
```

### Desktop Wireframe

```text
+--------------------------------------------------------+
| Skip link                                              |
| Header: Student Finance Tracker        Navigation      |
+--------------------------------------------------------+
| Dashboard cards: records | total | top category | cap   |
| Last 7 days chart                                      |
+-------------------------+------------------------------+
| Add/Edit Form           | Settings                     |
| Description             | Currency: RWF / USD          |
| Amount                  | Manual rate                  |
| Category                | Spending cap                 |
| Date                    | Import / Export              |
+-------------------------+------------------------------+
| Search, case toggle, sort controls                     |
+--------------------------------------------------------+
| Records Table                                           |
| Date | Description | Category | Amount | Actions        |
+--------------------------------------------------------+
| About / Contact                                         |
+--------------------------------------------------------+
```

## Planned File Structure

```text
index.html
README.md
seed.json
tests.html
styles/
  main.css
scripts/
  app.js
  state.js
  storage.js
  ui.js
  validators.js
  search.js
  stats.js
  settings.js
assets/
```

## Milestone Roadmap

### M1: Spec and Wireframes

I will prepare the project plan, data model, accessibility plan, and basic wireframes. This milestone proves that the app has been planned before development starts.

### M2: Semantic HTML and Base CSS

I will create the main page structure and mobile-first layout using semantic HTML.

### M3: Forms and Regex Validation

I will build the add/edit form, add validation rules, show useful error messages, and create simple tests.

### M4: Render, Sort, and Regex Search

I will render records, add sorting, add safe regex search, and highlight matches without breaking the page when a regex is invalid.

### M5: Stats and Cap

I will calculate dashboard totals, top category, last-7-days trend, and cap status with accessible messages.

### M6: Persistence, Import/Export, and Settings

I will save data to `localStorage`, validate imported JSON, export records, and manage currency settings for RWF, USD, and EUR.

### M7: Polish and Accessibility Audit

I will test keyboard navigation, check responsive layouts, improve visual polish, write the README, and prepare the demo video.

## Success Criteria

The project will be successful if a student can:

- Add a transaction quickly
- See totals and budget status clearly
- Search records using regex
- Sort and edit records without confusion
- Use the app on both phone and laptop screens
- Navigate the main features with only a keyboard
- Save, export, and import data correctly

## Reflection

This plan helps me focus on the main learning outcomes instead of only trying to make the app look finished. The strongest parts of the project should be the regex validation, the searchable records, the dashboard summary, and accessibility. I also want the app to feel realistic for students, especially by using RWF, USD, and EUR because students may come from different parts of the world and may carry different currencies.

The main risk is trying to add too many extra features before the required parts are complete. To avoid that, I will follow the milestones in order and make sure each stage works before moving to the next one.
