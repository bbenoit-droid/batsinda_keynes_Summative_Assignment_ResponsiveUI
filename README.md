# Student Budget Tracker

A small student-built web app for recording expenses, checking a monthly budget, and keeping a simple backup of saved data.


# Official website
https://github.com/bbenoit-droid/batsinda_keynes_Summative_Assignment_ResponsiveUI


# Video Demo:
https://www.youtube.com/watch?v=yd-rdbb69aA


## What It Does

- Add, edit, delete, search, and sort expenses.
- Show total expenses, number of records, main category, and remaining balance.
- Convert USD and EUR expenses into RWF totals using **manually configured exchange rates**.
- Save data and app settings in the browser (localStorage).
- Import/export JSON backups.
- Export expenses as CSV.
- Switch between light and dark mode.
- Configure display currency, default expense currency, chart visibility, compact table mode, and delete confirmation.

## Key Screens (Usage Walkthrough)

1. **Home**: project overview.
2. **Add Expense**: enter description, amount, currency, category, and date.
3. **Transactions**: review your saved expenses in a table.
   - Use **Search Expenses** to filter records.
   - Use **Sort Expenses** to order results.
4. **Summary**: view totals (and remaining budget) plus a weekly chart (if enabled).
5. **Settings**:
   - Enter/update the monthly budget.
   - Set exchange rates (USD→RWF, EUR→RWF).
   - Choose display currency and UI options.
   - Import/export JSON backups and export CSV.
   - Clear all data (optional confirmation).

## Data & Backups

- The app stores transactions and settings in **browser localStorage**.
- **JSON backups**: import/export a single backup file that can restore both transactions and settings.
- **CSV export**: exports the current expense records in a simple spreadsheet-friendly format.
- **Clear All Data**: removes stored transactions and settings from the browser.

### Exchange Rates (USD/EUR → RWF)

When you enter an expense in **USD** or **EUR**, the app converts it into **RWF** using the rates you set in **Settings**:
- USD to RWF rate
- EUR to RWF rate

## Project Files

```text
index.html
assets/
  css/student-budget.css
  js/main.js
  js/expenses.js
  js/budget.js
  js/formChecks.js
  js/searchTools.js
  js/savedData.js
seed.json
package.json
```

## Run The Project

1. Copy the project folder into XAMPP `htdocs`.
2. Start **Apache**.
3. Open `index.html` via your local server.

Example URL (update the path to match your folder name):

```text
http://localhost/batsinda_keynes_Summative_Assignment_ResponsiveUI/index.html
```

## Validate JavaScript Syntax

This repo includes a quick syntax check script:

```bash
npm run check
```

## Sample Data

On first run, the app loads sample expenses automatically if there is no saved data yet.

You can also import/restore a backup later using `seed.json` from the **Settings** section.

