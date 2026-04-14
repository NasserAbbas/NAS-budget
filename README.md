# NAS Budget

Desktop budget planner for tracking bills month by month, with salary, totals, recurring bills, notes, and year-to-year workflows.

## Installing (Windows)

1. Run the **NAS Budget** setup program (`NAS Budget Setup *.exe`).
2. Follow the installer. You can change the installation folder if you prefer.
3. Start the app from the desktop shortcut or the Start menu.

A copy of this file is installed next to the application (same folder as `NAS Budget.exe`) and is also placed beside the installer in the `dist` folder when the project is built.

## Your data

- Everything is stored **on your computer** (not in the cloud). Electron keeps web storage under your Windows user profile, typically in **AppData** under an app-specific folder (name follows the packaged app, e.g. `nas-desktop`).
- Use **Export** in the app to save a **JSON** backup you can keep anywhere safe.
- Use **Import** to load a previously exported JSON file.
- The **Restore history** section keeps automatic and manual backups; you can restore an older version from there.

## Using the app

- **Budget year** — Switch the year from the header. New years can start empty, copy names only, copy recurring flags, or copy the full previous year (you’ll be asked when needed).
- **Year actions** — Open the menu next to the year to reset the current year (with backup), undo a reset, or copy data to the next year in several ways.
- **Add bill** — Add rows for each bill. Use **R** on a row for recurring fill into future months. Row menus support lock, duplicate, remove, and trash recovery.
- **Salary / budget** — Enter monthly income in the salary row; **Total** and **Remaining** columns summarize spending and what’s left per month and for the year.
- **Themes** — Three themes are available from the header (including a dark theme).
- **Language** — English, Arabic (RTL), and Dutch are available from the language control.
- **Print / PDF** — Use your system print dialog to print or save as PDF.
- **Import formats** — JSON exports from NAS, or **CSV** exported from Google Sheets (**File → Download → Comma-separated values**).

## Uninstalling

Use **Settings → Apps** (or **Add or remove programs**) in Windows and uninstall **NAS Budget**. If you want to remove all local data as well, delete the app’s data folder under your user **AppData** after uninstalling (only if you no longer need backups there).

## Version

This readme matches **NAS Budget** version **1.0.0** (see the app or `package.json` if you build from source).

---

*NAS Budget — local-first personal budgeting.*
