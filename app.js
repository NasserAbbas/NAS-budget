(function () {
  "use strict";

  const STORAGE_KEY = "nas-budget-v2";
  const LEGACY_KEY = "nas-budget-v1";
  const BACKUP_STORAGE_KEY = "nas-budget-v2-backups";
  const ACTIVE_YEAR_KEY = "nas-budget-v2-active-year";
  const YEAR_RESET_UNDO_KEY = "nas-budget-v2-year-reset-undo";
  const SAVE_DEBOUNCE_MS = 400;
  const MAX_BACKUPS = 12;
  const BACKUP_MIN_INTERVAL_MS = 60000;

  function normalizeTheme(v) {
    return v === "paper" || v === "dark" ? v : "green";
  }

  const I18N = {
    en: {
      docTitle: "NAS — Budget",
      budgetBanner: "Budget {year}",
      yearSr: "Budget year",
      themeSr: "Theme",
      themeGreen: "Theme 1",
      themePaper: "Theme 2",
      themeDark: "Theme 3",
      currencySr: "Currency",
      currencyNone: "— None",
      yearActions: "Year actions",
      resetYear: "Reset year",
      resetYearConfirm: "Clear the current year and start again with the default starter bills (all editable)? A backup of the current year will be saved first.",
      yearReset: "Year reset to starter bills",
      undoResetYear: "Undo reset year",
      yearResetUndone: "Year reset undone",
      noYearResetUndo: "Nothing to undo for this year",
      emptyNextYear: "Open {year} with starter bills",
      emptyNextYearConfirm: "Start {year} with the default starter bills (all editable)? Existing data in {year} will be replaced.",
      namesNextYear: "Copy names only to {year}",
      namesNextYearConfirm: "Copy only bill names from {from} to {to}? Existing data in {to} will be replaced.",
      recurringNextYear: "Copy names + recurring to {year}",
      recurringNextYearConfirm: "Copy bill names and recurring marks from {from} to {to}? Existing data in {to} will be replaced.",
      copyToNextYear: "Copy full to {year}",
      copyToNextYearConfirm: "Copy the full budget from {from} to {to}? Existing data in {to} will be replaced.",
      emptyYearOpened: "Opened with starter bills",
      namesCopiedToNext: "Bill names copied to next year",
      recurringCopiedToNext: "Bill names and recurring marks copied to next year",
      yearCopiedToNext: "Copied to next year",
      maxYearReached: "Maximum year reached",
      langGroup: "Language",
      printPdf: "Print / PDF",
      export: "Export",
      import: "Import",
      hint: "Scroll sideways on your phone. Totals work like your sheet: each row sums across months; each month sums down the column. Import JSON or a Google Sheet CSV (File → Download → Comma-separated values).",
      panelExpenses: "Expenses by month",
      searchBills: "Search bills",
      searchBillsPlaceholder: "Search bill names...",
      filterGroup: "Bill filters",
      filterAll: "All",
      filterHighSpending: "High spending",
      recurringRow: "Recurring on",
      recurringRowOff: "Mark recurring",
      recurringRowHintOn: "Recurring is on. Click R again to undo the auto-filled future months.",
      recurringRowHintOff: "Click R to auto-fill future empty months in this row from the last entered value.",
      recurringCopyNext: "Copy recurring {from} to {to}",
      recurringCopyHint: "Copies only recurring rows from one month to the next month.",
      recurringCopyConfirm: "Copy only recurring bills from {from} to {to}? This will replace recurring bill data already in {to}.",
      recurringCopied: "Recurring bills copied",
      noRecurringRows: "No recurring bills to copy.",
      recurringFilled: "Recurring bill filled forward",
      recurringRestored: "Recurring changes undone",
      yearTemplateTitle: "New year {year}",
      yearTemplateText: "How should NAS start for this year?",
      yearTemplateEmpty: "Starter bills (default)",
      yearTemplateNames: "Copy bill names only",
      yearTemplateRecurring: "Copy names + recurring only",
      yearTemplateFull: "Copy full previous year",
      duplicateRow: "Duplicate row",
      duplicateMonthNext: "Copy {from} to {to}",
      duplicateMonthConfirm: "Copy all values and comments from {from} to {to}? This will replace the current data in {to}.",
      tagColorAria: "Category color tag",
      tagColorNone: "No tag",
      tagColorGreen: "Green tag",
      tagColorBlue: "Blue tag",
      tagColorOrange: "Orange tag",
      tagColorPurple: "Purple tag",
      tagColorRose: "Rose tag",
      trendHighest: "Highest month",
      trendLowest: "Lowest month",
      trendAverage: "Average / month",
      trendBestBalance: "Best remaining",
      addBill: "+ Add bill",
      addBillShortcutTitle: "Add bill (Ctrl+N)",
      colBill: "Bill",
      billHint: "Bill name. The colored dot on the left is the row tag and helps you group bills visually.",
      colRef: "Ref",
      colTotal: "Total",
      rowActionsSr: "Row actions",
      chartTitle: "Spending by month",
      chartAria: "Monthly spending chart",
      notes: "Notes",
      notesPlaceholder: "Optional…",
      backupsTitle: "Restore history",
      manualBackup: "Save backup",
      manualBackupHint: "Save the current budget to restore history right now.",
      manualBackupDone: "Backup saved",
      clearBackups: "Clear history",
      backupsEmpty: "Automatic backups will appear here.",
      backupRestore: "Restore backup",
      backupRestoreConfirm: "Restore this backup? Your current budget will be replaced, but a fresh backup of the current version will be saved first.",
      backupRestored: "Backup restored",
      backupLabel: "Auto backup",
      backupReasonAuto: "Auto backup",
      backupReasonResetYear: "Before reset year",
      backupReasonUndoResetYear: "Before undo reset",
      backupReasonPreRestore: "Before restore backup",
      backupReasonOverwriteNextYear: "Before overwrite next year",
      backupReasonUnknown: "Saved backup",
      backupReasonManual: "Manual save",
      yearsTitle: "Year overview",
      yearsEmpty: "Your saved years will appear here.",
      openYear: "Open",
      currentYear: "Current",
      yearBillsCount: "{count} bills",
      yearExpenseTotal: "Spending {amount}",
      yearSalaryTotal: "Salary {amount}",
      yearRemainingTotal: "Remaining {amount}",
      yearNoteLabel: "Note: {text}",
      trashTitle: "Trash bin",
      clearTrash: "Clear trash",
      trashEmpty: "Deleted bills will appear here.",
      restoreRow: "Restore",
      deleteForever: "Delete forever",
      salaryLabel: "Salary (income per month)",
      total: "Total",
      remaining: "Remaining",
      salaryHint: "Monthly income values. The total on the right is the full year salary sum.",
      salaryCellHint:
        "Enter this month's salary or budget here. The Total column on the right is the sum for the full year.",
      totalHint: "Each month here is the sum of all bill amounts in that month. The total on the right is the full year spending sum.",
      remainingHint: "Remaining is salary minus spending for that month. The total on the right is the full year remaining balance.",
      yearSalaryTotalHint: "Full year salary total",
      monthTotalHint: "{month} total spending",
      yearTotalHint: "Full year spending total",
      remainingMonthHint: "{month} remaining after salary",
      yearRemainingHint: "Full year remaining after salary",
      billNameAria: "Bill name",
      refAmountAria: "Reference amount",
      monthAmountAria: "{month} amount",
      salaryMonthAria: "Salary {month}",
      lockRow: "Lock row",
      unlockRow: "Unlock row",
      lockRowHint: "Lock this row so its bill name, values, and comments cannot be edited by mistake.",
      unlockRowHint: "Unlock this row so it can be edited again.",
      unlockBeforeDelete: "Unlock row before removing it",
      duplicateRowHint: "Create a copy of this row below.",
      removeRow: "Remove row",
      undoDelete: "Undo",
      rowAdded: "Row added",
      rowDeleted: "Row deleted",
      monthCopied: "Month copied",
      saved: "Saved",
      couldNotSave: "Could not save",
      badImport: "Unrecognized file format.",
      badJson: "Could not read JSON.",
      colComment: "Comment",
      salaryShort: "Budget / Salary",
      cellCommentAria: "Comment on this cell",
      contextCut: "Cut",
      contextCopy: "Copy",
      contextPaste: "Paste",
      contextAddComment: "Add comment",
      contextEditComment: "Edit comment",
      contextDeleteComment: "Delete comment",
      clipboardUnavailable: "Clipboard action is not available here.",
      noteDialogTitle: "Cell comment",
      noteSave: "Save",
      noteClear: "Clear",
      noteCancel: "Cancel",
      hintComments: " Corner marker = a comment on that amount. Click the small triangle to view or edit.",
      noSearchResults: "No bills match the current search or filter.",
    },
    ar: {
      docTitle: "NAS — الميزانية",
      budgetBanner: "ميزانية {year}",
      yearSr: "سنة الميزانية",
      themeSr: "المظهر",
      themeGreen: "Theme 1",
      themePaper: "Theme 2",
      themeDark: "Theme 3",
      currencySr: "العملة",
      currencyNone: "— بدون",
      yearActions: "خيارات السنة",
      resetYear: "إعادة ضبط السنة",
      resetYearConfirm: "هل تريد مسح السنة الحالية والبدء من جديد بقائمة الفواتير الافتراضية (كلها قابلة للتحرير)؟ سيتم حفظ نسخة احتياطية من السنة الحالية أولاً.",
      yearReset: "تمت إعادة السنة إلى قائمة الفواتير الافتراضية",
      undoResetYear: "التراجع عن إعادة الضبط",
      yearResetUndone: "تم التراجع عن إعادة ضبط السنة",
      noYearResetUndo: "لا يوجد تراجع متاح لهذه السنة",
      emptyNextYear: "فتح {year} بقائمة الفواتير الافتراضية",
      emptyNextYearConfirm: "هل تريد بدء سنة {year} بقائمة الفواتير الافتراضية (كلها قابلة للتحرير)؟ سيتم استبدال البيانات الموجودة في {year}.",
      namesNextYear: "نسخ الأسماء فقط إلى {year}",
      namesNextYearConfirm: "هل تريد نسخ أسماء الفواتير فقط من {from} إلى {to}؟ سيتم استبدال البيانات الموجودة في {to}.",
      recurringNextYear: "نسخ الأسماء والتكرار إلى {year}",
      recurringNextYearConfirm: "هل تريد نسخ أسماء الفواتير وعلامات التكرار من {from} إلى {to}؟ سيتم استبدال البيانات الموجودة في {to}.",
      copyToNextYear: "نسخ كامل إلى {year}",
      copyToNextYearConfirm: "هل تريد نسخ الميزانية كاملة من {from} إلى {to}؟ سيتم استبدال البيانات الموجودة في {to}.",
      emptyYearOpened: "تم الفتح بقائمة الفواتير الافتراضية",
      namesCopiedToNext: "تم نسخ أسماء الفواتير إلى السنة التالية",
      recurringCopiedToNext: "تم نسخ أسماء الفواتير وعلامات التكرار إلى السنة التالية",
      yearCopiedToNext: "تم النسخ إلى السنة التالية",
      maxYearReached: "تم الوصول إلى الحد الأقصى للسنة",
      langGroup: "اللغة",
      printPdf: "طباعة / PDF",
      export: "تصدير",
      import: "استيراد",
      hint: "مرّر الجدول أفقيًا على الهاتف. المجاميع كالجدول: كل صف يجمع الأشهر؛ كل عمود يجمع المصروفات في ذلك الشهر. يمكن استيراد JSON أو CSV من جداول Google (ملف → تنزيل).",
      panelExpenses: "المصروفات حسب الشهر",
      searchBills: "البحث في الفواتير",
      searchBillsPlaceholder: "ابحث عن اسم الفاتورة...",
      filterGroup: "فلاتر الفواتير",
      filterAll: "الكل",
      filterHighSpending: "إنفاق مرتفع",
      recurringRow: "التكرار مفعل",
      recurringRowOff: "تفعيل التكرار",
      recurringRowHintOn: "التكرار مفعل. انقر R مرة أخرى للتراجع عن تعبئة الأشهر المستقبلية تلقائيًا.",
      recurringRowHintOff: "انقر R لتعبئة الأشهر المستقبلية الفارغة في هذا الصف تلقائيًا من آخر قيمة مدخلة.",
      recurringCopyNext: "نسخ الفواتير المتكررة من {from} إلى {to}",
      recurringCopyHint: "ينسخ الصفوف المتكررة فقط من شهر إلى الشهر التالي.",
      recurringCopyConfirm: "هل تريد نسخ الفواتير المتكررة فقط من {from} إلى {to}؟ سيتم استبدال بيانات الفواتير المتكررة الموجودة في {to}.",
      recurringCopied: "تم نسخ الفواتير المتكررة",
      noRecurringRows: "لا توجد فواتير متكررة لنسخها.",
      recurringFilled: "تمت تعبئة الفاتورة المتكررة للأشهر التالية",
      recurringRestored: "تم التراجع عن التكرار",
      yearTemplateTitle: "سنة جديدة {year}",
      yearTemplateText: "كيف يجب أن يبدأ NAS لهذه السنة؟",
      yearTemplateEmpty: "قائمة الفواتير الافتراضية",
      yearTemplateNames: "نسخ أسماء الفواتير فقط",
      yearTemplateRecurring: "نسخ الأسماء والتكرار فقط",
      yearTemplateFull: "نسخ السنة السابقة كاملة",
      duplicateRow: "نسخ الصف",
      duplicateMonthNext: "نسخ {from} إلى {to}",
      duplicateMonthConfirm: "نسخ كل القيم والتعليقات من {from} إلى {to}؟ سيؤدي هذا إلى استبدال البيانات الحالية في {to}.",
      tagColorAria: "لون تصنيف الفاتورة",
      tagColorNone: "بدون لون",
      tagColorGreen: "تصنيف أخضر",
      tagColorBlue: "تصنيف أزرق",
      tagColorOrange: "تصنيف برتقالي",
      tagColorPurple: "تصنيف بنفسجي",
      tagColorRose: "تصنيف وردي",
      trendHighest: "أعلى شهر",
      trendLowest: "أقل شهر",
      trendAverage: "متوسط / شهر",
      trendBestBalance: "أفضل متبقٍ",
      addBill: "+ إضافة فاتورة",
      addBillShortcutTitle: "إضافة فاتورة (Ctrl+N)",
      colBill: "الفاتورة",
      billHint: "اسم الفاتورة. النقطة الملونة على اليسار هي وسم الصف وتساعدك على تجميع الفواتير بصريًا.",
      colRef: "المبلغ",
      colTotal: "المجموع",
      rowActionsSr: "إجراءات الصف",
      chartTitle: "الإنفاق حسب الشهر",
      chartAria: "رسم الإنفاق الشهري",
      notes: "ملاحظات",
      notesPlaceholder: "اختياري…",
      backupsTitle: "سجل الاستعادة",
      manualBackup: "حفظ نسخة",
      manualBackupHint: "حفظ الميزانية الحالية في سجل الاستعادة الآن.",
      manualBackupDone: "تم حفظ النسخة",
      clearBackups: "مسح السجل",
      backupsEmpty: "ستظهر النسخ الاحتياطية التلقائية هنا.",
      backupRestore: "استعادة النسخة",
      backupRestoreConfirm: "هل تريد استعادة هذه النسخة؟ سيتم استبدال الميزانية الحالية، مع حفظ نسخة احتياطية جديدة من الوضع الحالي أولاً.",
      backupRestored: "تمت استعادة النسخة",
      backupLabel: "نسخة تلقائية",
      backupReasonAuto: "نسخة تلقائية",
      backupReasonResetYear: "قبل إعادة ضبط السنة",
      backupReasonUndoResetYear: "قبل التراجع عن إعادة الضبط",
      backupReasonPreRestore: "قبل استعادة النسخة",
      backupReasonOverwriteNextYear: "قبل استبدال السنة التالية",
      backupReasonUnknown: "نسخة محفوظة",
      backupReasonManual: "حفظ يدوي",
      yearsTitle: "نظرة على السنوات",
      yearsEmpty: "ستظهر السنوات المحفوظة هنا.",
      openYear: "فتح",
      currentYear: "الحالية",
      yearBillsCount: "{count} فاتورة",
      yearExpenseTotal: "الإنفاق {amount}",
      yearSalaryTotal: "الراتب {amount}",
      yearRemainingTotal: "المتبقي {amount}",
      yearNoteLabel: "ملاحظة: {text}",
      trashTitle: "سلة المحذوفات",
      clearTrash: "إفراغ السلة",
      trashEmpty: "ستظهر الفواتير المحذوفة هنا.",
      restoreRow: "استعادة",
      deleteForever: "حذف نهائي",
      salaryLabel: "الراتب (الدخل الشهري)",
      total: "المجموع",
      remaining: "المتبقي",
      salaryHint: "هذه قيم الدخل الشهرية. المجموع في اليمين هو مجموع الراتب السنوي الكامل.",
      salaryCellHint:
        "أدخل راتبك أو ميزانيتك لهذا الشهر هنا. عمود المجموع على اليمين هو مجموع السنة كاملة.",
      totalHint: "كل شهر هنا هو مجموع كل مبالغ الفواتير في ذلك الشهر. المجموع في اليمين هو مجموع الإنفاق السنوي الكامل.",
      remainingHint: "المتبقي هو الراتب ناقص الإنفاق لذلك الشهر. المجموع في اليمين هو الرصيد السنوي المتبقي.",
      yearSalaryTotalHint: "إجمالي الراتب السنوي",
      monthTotalHint: "إجمالي إنفاق {month}",
      yearTotalHint: "إجمالي الإنفاق السنوي",
      remainingMonthHint: "المتبقي في {month} بعد الراتب",
      yearRemainingHint: "المتبقي السنوي بعد الراتب",
      billNameAria: "اسم الفاتورة",
      refAmountAria: "مبلغ مرجعي",
      monthAmountAria: "مبلغ {month}",
      salaryMonthAria: "راتب {month}",
      lockRow: "قفل الصف",
      unlockRow: "إلغاء قفل الصف",
      lockRowHint: "اقفل هذا الصف حتى لا يمكن تعديل اسم الفاتورة أو القيم أو التعليقات بالخطأ.",
      unlockRowHint: "ألغِ قفل هذا الصف حتى يصبح قابلاً للتعديل مرة أخرى.",
      unlockBeforeDelete: "ألغِ قفل الصف قبل حذفه",
      duplicateRowHint: "أنشئ نسخة من هذا الصف أسفل الصف الحالي.",
      removeRow: "حذف الصف",
      undoDelete: "تراجع",
      rowAdded: "تمت إضافة صف",
      rowDeleted: "تم حذف الصف",
      monthCopied: "تم نسخ الشهر",
      saved: "تم الحفظ",
      couldNotSave: "تعذّر الحفظ",
      badImport: "صيغة الملف غير معروفة.",
      badJson: "تعذّر قراءة JSON.",
      colComment: "تعليق",
      salaryShort: "الراتب/ الميزانية",
      cellCommentAria: "تعليق على هذه الخانة",
      contextCut: "قص",
      contextCopy: "نسخ",
      contextPaste: "لصق",
      contextAddComment: "إضافة تعليق",
      contextEditComment: "تعديل التعليق",
      contextDeleteComment: "حذف التعليق",
      clipboardUnavailable: "إجراء الحافظة غير متاح هنا.",
      noteDialogTitle: "تعليق الخانة",
      noteSave: "حفظ",
      noteClear: "مسح",
      noteCancel: "إلغاء",
      hintComments: " العلامة في الزاوية تعني وجود تعليق. انقر المثلث الصغير للعرض أو التعديل.",
      noSearchResults: "لا توجد فواتير تطابق البحث أو الفلتر الحالي.",
    },
    nl: {
      docTitle: "NAS — Budget",
      budgetBanner: "Budget {year}",
      yearSr: "Budgetjaar",
      themeSr: "Thema",
      themeGreen: "Thema 1",
      themePaper: "Thema 2",
      themeDark: "Thema 3",
      currencySr: "Valuta",
      currencyNone: "— Geen",
      yearActions: "Jaaracties",
      resetYear: "Jaar resetten",
      resetYearConfirm: "Huidige jaar wissen en opnieuw beginnen met de standaard voorbeeldfacturen (alles aanpasbaar)? Eerst wordt een back-up van dit jaar opgeslagen.",
      yearReset: "Jaar gereset naar standaardfacturen",
      undoResetYear: "Reset ongedaan maken",
      yearResetUndone: "Jaar-reset ongedaan gemaakt",
      noYearResetUndo: "Niets om ongedaan te maken voor dit jaar",
      emptyNextYear: "{year} openen met standaardfacturen",
      emptyNextYearConfirm: "{year} starten met de standaard voorbeeldfacturen (alles aanpasbaar)? Bestaande gegevens in {year} worden vervangen.",
      namesNextYear: "Alleen namen kopiëren naar {year}",
      namesNextYearConfirm: "Alleen factuurnamen van {from} naar {to} kopiëren? Bestaande gegevens in {to} worden vervangen.",
      recurringNextYear: "Namen + terugkerend naar {year}",
      recurringNextYearConfirm: "Factuurnamen en terugkerend-vlag van {from} naar {to} kopiëren? Bestaande gegevens in {to} worden vervangen.",
      copyToNextYear: "Volledig kopiëren naar {year}",
      copyToNextYearConfirm: "Volledige budget van {from} naar {to} kopiëren? Bestaande gegevens in {to} worden vervangen.",
      emptyYearOpened: "Geopend met standaardfacturen",
      namesCopiedToNext: "Factuurnamen gekopieerd naar volgend jaar",
      recurringCopiedToNext: "Namen en terugkerend gekopieerd naar volgend jaar",
      yearCopiedToNext: "Gekopieerd naar volgend jaar",
      maxYearReached: "Maximumjaar bereikt",
      langGroup: "Taal",
      printPdf: "Afdrukken / PDF",
      export: "Exporteren",
      import: "Importeren",
      hint: "Op je telefoon horizontaal scrollen. Totalen werken als in je sheet: elke rij telt de maanden op; elke kolom telt de uitgaven van die maand. Importeer JSON of een Google Sheet CSV (Bestand → Downloaden → Komma-gescheiden).",
      panelExpenses: "Uitgaven per maand",
      searchBills: "Facturen zoeken",
      searchBillsPlaceholder: "Zoek op factuurnaam…",
      filterGroup: "Filters",
      filterAll: "Alles",
      filterHighSpending: "Hoge uitgaven",
      recurringRow: "Terugkerend aan",
      recurringRowOff: "Terugkerend markeren",
      recurringRowHintOn: "Terugkerend staat aan. Klik nogmaals op R om automatisch ingevulde maanden ongedaan te maken.",
      recurringRowHintOff: "Klik op R om lege toekomstige maanden in deze rij automatisch te vullen met de laatst ingevoerde waarde.",
      recurringCopyNext: "Terugkerend {from} naar {to}",
      recurringCopyHint: "Kopieert alleen terugkerende rijen van de ene maand naar de volgende.",
      recurringCopyConfirm: "Alleen terugkerende facturen van {from} naar {to} kopiëren? Dit vervangt bestaande terugkerende gegevens in {to}.",
      recurringCopied: "Terugkerende facturen gekopieerd",
      noRecurringRows: "Geen terugkerende facturen om te kopiëren.",
      recurringFilled: "Terugkerende factuur vooruit ingevuld",
      recurringRestored: "Terugkerende wijzigingen ongedaan gemaakt",
      yearTemplateTitle: "Nieuw jaar {year}",
      yearTemplateText: "Hoe moet NAS dit jaar starten?",
      yearTemplateEmpty: "Standaardfacturen",
      yearTemplateNames: "Alleen factuurnamen kopiëren",
      yearTemplateRecurring: "Alleen namen + terugkerend",
      yearTemplateFull: "Vorig jaar volledig kopiëren",
      duplicateRow: "Rij dupliceren",
      duplicateMonthNext: "{from} naar {to} kopiëren",
      duplicateMonthConfirm: "Alle waarden en opmerkingen van {from} naar {to} kopiëren? Dit vervangt de huidige gegevens in {to}.",
      tagColorAria: "Kleur-tag voor categorie",
      tagColorNone: "Geen tag",
      tagColorGreen: "Groene tag",
      tagColorBlue: "Blauwe tag",
      tagColorOrange: "Oranje tag",
      tagColorPurple: "Paarse tag",
      tagColorRose: "Roze tag",
      trendHighest: "Hoogste maand",
      trendLowest: "Laagste maand",
      trendAverage: "Gemiddelde / maand",
      trendBestBalance: "Beste saldo",
      addBill: "+ Factuur toevoegen",
      addBillShortcutTitle: "Factuur toevoegen (Ctrl+N)",
      colBill: "Factuur",
      billHint: "Factuurnaam. De gekleurde stip links is een rij-tag om facturen visueel te groeperen.",
      colRef: "Ref",
      colTotal: "Totaal",
      rowActionsSr: "Rijacties",
      chartTitle: "Uitgaven per maand",
      chartAria: "Diagram maandelijkse uitgaven",
      notes: "Notities",
      notesPlaceholder: "Optioneel…",
      backupsTitle: "Herstelgeschiedenis",
      manualBackup: "Back-up opslaan",
      manualBackupHint: "Huidige budget nu in de herstelgeschiedenis opslaan.",
      manualBackupDone: "Back-up opgeslagen",
      clearBackups: "Geschiedenis wissen",
      backupsEmpty: "Automatische back-ups verschijnen hier.",
      backupRestore: "Back-up herstellen",
      backupRestoreConfirm: "Deze back-up herstellen? Het huidige budget wordt vervangen, maar eerst wordt een verse back-up van de huidige versie opgeslagen.",
      backupRestored: "Back-up hersteld",
      backupLabel: "Auto back-up",
      backupReasonAuto: "Automatische back-up",
      backupReasonResetYear: "Voor jaar resetten",
      backupReasonUndoResetYear: "Voor ongedaan reset",
      backupReasonPreRestore: "Voor herstel back-up",
      backupReasonOverwriteNextYear: "Voor overschrijven volgend jaar",
      backupReasonUnknown: "Opgeslagen back-up",
      backupReasonManual: "Handmatige opslag",
      yearsTitle: "Jaaroverzicht",
      yearsEmpty: "Opgeslagen jaren verschijnen hier.",
      openYear: "Openen",
      currentYear: "Huidig",
      yearBillsCount: "{count} facturen",
      yearExpenseTotal: "Uitgaven {amount}",
      yearSalaryTotal: "Salaris {amount}",
      yearRemainingTotal: "Resterend {amount}",
      yearNoteLabel: "Notitie: {text}",
      trashTitle: "Prullenbak",
      clearTrash: "Prullenbak legen",
      trashEmpty: "Verwijderde facturen verschijnen hier.",
      restoreRow: "Herstellen",
      deleteForever: "Definitief verwijderen",
      salaryLabel: "Salaris (inkomen per maand)",
      total: "Totaal",
      remaining: "Resterend",
      salaryHint: "Maandelijkse inkomensbedragen. Het totaal rechts is de som van het salaris over het jaar.",
      salaryCellHint:
        "Vul hier je salaris of budget voor deze maand in. De kolom Totaal rechts is de som van het hele jaar.",
      totalHint: "Elke maand hier is de som van alle factuur­bedragen in die maand. Het totaal rechts is de totale jaaruitgave.",
      remainingHint: "Resterend is salaris min uitgaven voor die maand. Het totaal rechts is het resterende saldo over het jaar.",
      yearSalaryTotalHint: "Totaal salaris jaar",
      monthTotalHint: "Totale uitgaven {month}",
      yearTotalHint: "Totale jaaruitgaven",
      remainingMonthHint: "Resterend in {month} na salaris",
      yearRemainingHint: "Jaar resterend na salaris",
      billNameAria: "Factuurnaam",
      refAmountAria: "Referentiebedrag",
      monthAmountAria: "Bedrag {month}",
      salaryMonthAria: "Salaris {month}",
      lockRow: "Rij vergrendelen",
      unlockRow: "Rij ontgrendelen",
      lockRowHint: "Vergrendel deze rij zodat naam, bedragen en opmerkingen niet per ongeluk worden gewijzigd.",
      unlockRowHint: "Ontgrendel deze rij om weer te kunnen bewerken.",
      unlockBeforeDelete: "Rij ontgrendelen voordat u deze verwijdert",
      duplicateRowHint: "Maak hieronder een kopie van deze rij.",
      removeRow: "Rij verwijderen",
      undoDelete: "Ongedaan maken",
      rowAdded: "Rij toegevoegd",
      rowDeleted: "Rij verwijderd",
      monthCopied: "Maand gekopieerd",
      saved: "Opgeslagen",
      couldNotSave: "Kon niet opslaan",
      badImport: "Onbekend bestandsformaat.",
      badJson: "JSON kon niet worden gelezen.",
      colComment: "Opmerking",
      salaryShort: "Budget / Salaris",
      cellCommentAria: "Opmerking bij dit veld",
      contextCut: "Knippen",
      contextCopy: "Kopiëren",
      contextPaste: "Plakken",
      contextAddComment: "Opmerking toevoegen",
      contextEditComment: "Opmerking bewerken",
      contextDeleteComment: "Opmerking verwijderen",
      clipboardUnavailable: "Klembordactie hier niet beschikbaar.",
      noteDialogTitle: "Celopmerking",
      noteSave: "Opslaan",
      noteClear: "Wissen",
      noteCancel: "Annuleren",
      hintComments: " Hoekje = opmerking bij dat bedrag. Klik op het driehoekje om te bekijken of te bewerken.",
      noSearchResults: "Geen facturen die overeenkomen met zoeken of filter.",
    },
  };

  const SUPPORTED_LOCALES = ["en", "ar", "nl"];

  function resolveLocale(loc) {
    const l = String(loc || "");
    return SUPPORTED_LOCALES.includes(l) ? l : "en";
  }

  const MONTHS_I18N = {
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
    nl: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
  };

  /** Short labels for table column headers (fit grid on screen like Sheets). */
  const MONTHS_GRID_HEADER = {
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
    nl: ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
  };

  function browserDefaultLocale() {
    try {
      const nav = (navigator.language || "").toLowerCase();
      if (nav.startsWith("ar")) return "ar";
      if (nav.startsWith("nl")) return "nl";
    } catch (_) {}
    return "en";
  }

  function uid() {
    return "c_" + Math.random().toString(36).slice(2, 11);
  }

  function emptyMonths() {
    return Array(12).fill("");
  }

  function storageKeyForYear(year) {
    return STORAGE_KEY + "-year-" + String(year);
  }

  const TAG_COLORS = [
    { key: "", color: "#cbd5e1" },
    { key: "green", color: "#7fb37f" },
    { key: "blue", color: "#7aa8d8" },
    { key: "orange", color: "#e8ad68" },
    { key: "purple", color: "#ae8ad7" },
    { key: "rose", color: "#de8da1" },
  ];

  function padString12(arr) {
    const a = Array.isArray(arr) ? arr.map((x) => (x == null ? "" : String(x))) : emptyMonths();
    while (a.length < 12) a.push("");
    return a.slice(0, 12);
  }

  /** Editable example rows for first launch (and repaired empty saves). Names are English; users can rename and retag freely. */
  function defaultStarterCategories() {
    const row = (name, tagColor) => ({
      id: uid(),
      name,
      ref: "",
      months: emptyMonths(),
      comments: emptyMonths(),
      rowComment: "",
      tagColor: tagColor || "",
      locked: false,
      recurring: false,
    });
    return [
      row("House rent", ""),
      row("Electricity", "green"),
      row("Water", ""),
      row("Internet", "blue"),
      row("Shopping", ""),
      row("Insurance", "purple"),
      row("Car", ""),
      row("Home Maintenance", "orange"),
      row("Restaurants", ""),
      row("", ""),
      row("", ""),
      row("", ""),
    ];
  }

  function defaultState() {
    const y = new Date().getFullYear();
    return {
      version: 2,
      locale: browserDefaultLocale(),
      theme: "green",
      year: y,
      currency: "$",
      categories: defaultStarterCategories(),
      salary: emptyMonths(),
      salaryComments: emptyMonths(),
      salaryRowComment: "",
      notes: "",
      trash: [],
    };
  }

  function emptyTemplateState(year, previousState) {
    const base = previousState && typeof previousState === "object" ? previousState : defaultState();
    return {
      version: 2,
      locale: resolveLocale(base.locale),
      theme: normalizeTheme(base.theme),
      year: Number.isFinite(year) ? year : base.year,
      currency: base.currency != null ? String(base.currency) : "$",
      categories: defaultStarterCategories(),
      salary: emptyMonths(),
      salaryComments: emptyMonths(),
      salaryRowComment: "",
      notes: "",
      trash: [],
    };
  }

  function namesTemplateState(year, previousState) {
    const base = emptyTemplateState(year, previousState);
    const sourceCategories = previousState && Array.isArray(previousState.categories) ? previousState.categories : [];
    const copiedCategories = sourceCategories
      .map((cat) => ({
        id: uid(),
        name: String(cat && cat.name ? cat.name : ""),
        ref: "",
        months: emptyMonths(),
        comments: emptyMonths(),
        rowComment: "",
        tagColor: "",
        locked: false,
        recurring: false,
      }))
      .filter((cat) => cat.name.trim());
    if (copiedCategories.length) base.categories = copiedCategories;
    return base;
  }

  function recurringTemplateState(year, previousState) {
    const base = emptyTemplateState(year, previousState);
    const sourceCategories = previousState && Array.isArray(previousState.categories) ? previousState.categories : [];
    const copiedCategories = sourceCategories
      .map((cat) => ({
        id: uid(),
        name: String(cat && cat.name ? cat.name : ""),
        ref: "",
        months: emptyMonths(),
        comments: emptyMonths(),
        rowComment: "",
        tagColor: "",
        locked: false,
        recurring: Boolean(cat && cat.recurring),
      }))
      .filter((cat) => cat.name.trim());
    if (copiedCategories.length) base.categories = copiedCategories;
    return base;
  }

  function fullYearTemplateState(year, previousState) {
    if (!previousState || typeof previousState !== "object") return emptyTemplateState(year);
    return normalizeState({
      version: 2,
      locale: previousState.locale,
      theme: previousState.theme,
      year,
      currency: previousState.currency,
      categories: Array.isArray(previousState.categories) ? previousState.categories.map((cat) => cloneCategory(cat)) : [],
      salary: padString12(previousState.salary),
      salaryComments: padString12(previousState.salaryComments),
      salaryRowComment: previousState.salaryRowComment != null ? String(previousState.salaryRowComment) : "",
      notes: previousState.notes != null ? String(previousState.notes) : "",
      trash: [],
    });
  }

  function t(key) {
    const loc = resolveLocale(state && state.locale);
    const pack = I18N[loc] || I18N.en;
    return pack[key] != null ? pack[key] : I18N.en[key] || key;
  }

  function tReplace(key, vars) {
    let s = t(key);
    if (vars) {
      for (const k of Object.keys(vars)) {
        s = s.replace(new RegExp("\\{" + k + "\\}", "g"), String(vars[k]));
      }
    }
    return s;
  }

  function appendHintBadge(parent, text) {
    if (!parent || !text) return;
    const badge = document.createElement("span");
    badge.className = "inline-hint-badge";
    badge.textContent = "?";
    badge.setAttribute("title", text);
    badge.setAttribute("aria-label", text);
    parent.appendChild(badge);
  }

  function monthName(i) {
    const loc = resolveLocale(state.locale);
    const row = MONTHS_I18N[loc] || MONTHS_I18N.en;
    return row[i] != null ? row[i] : MONTHS_I18N.en[i];
  }

  function duplicateMonthToNext(i) {
    if (!Number.isInteger(i) || i < 0 || i > 10) return;
    const from = monthName(i);
    const to = monthName(i + 1);
    const ok = window.confirm(tReplace("duplicateMonthConfirm", { from, to }));
    if (!ok) return;
    state.salary[i + 1] = state.salary[i];
    state.salaryComments[i + 1] = state.salaryComments[i];
    state.categories.forEach((cat) => {
      cat.months = padString12(cat.months);
      cat.comments = padString12(cat.comments);
      cat.months[i + 1] = cat.months[i];
      cat.comments[i + 1] = cat.comments[i];
    });
    el.saveStatus.textContent = t("monthCopied");
    scheduleSave();
    renderAll();
  }

  function duplicateRecurringMonthToNext(i) {
    if (!Number.isInteger(i) || i < 0 || i > 10) return;
    const recurringRows = state.categories.filter((cat) => cat.recurring);
    if (!recurringRows.length) {
      el.saveStatus.textContent = t("noRecurringRows");
      return;
    }
    const from = monthName(i);
    const to = monthName(i + 1);
    const ok = window.confirm(tReplace("recurringCopyConfirm", { from, to }));
    if (!ok) return;
    recurringRows.forEach((cat) => {
      cat.months = padString12(cat.months);
      cat.months[i + 1] = cat.months[i];
    });
    el.saveStatus.textContent = t("recurringCopied");
    scheduleSave();
    renderAll();
  }

  function fillRecurringRow(cat) {
    cat.months = padString12(cat.months);
    let lastValue = "";
    const changes = [];
    for (let i = 0; i < 12; i++) {
      const monthValue = String(cat.months[i] || "").trim();
      if (monthValue) {
        lastValue = cat.months[i];
        continue;
      }
      if (!lastValue) continue;
      changes.push({
        index: i,
        previousValue: String(cat.months[i] || ""),
        nextValue: String(lastValue || ""),
      });
      cat.months[i] = lastValue;
    }
    return changes;
  }

  function rememberRecurringUndo(cat, changes) {
    if (!cat || !cat.id) return;
    if (!Array.isArray(changes) || !changes.length) {
      delete recurringUndoByRowId[cat.id];
      return;
    }
    recurringUndoByRowId[cat.id] = { changes: changes.slice() };
  }

  function restoreRecurringUndo(cat) {
    if (!cat || !cat.id) return false;
    const snapshot = recurringUndoByRowId[cat.id];
    if (!snapshot) return false;
    cat.months = padString12(cat.months);
    let restored = false;
    const changes = Array.isArray(snapshot.changes) ? snapshot.changes : [];
    changes.forEach((change) => {
      const idx = Number(change && change.index);
      if (!Number.isInteger(idx) || idx < 0 || idx > 11) return;
      const currentValue = String(cat.months[idx] || "");
      const filledValue = String(change && change.nextValue ? change.nextValue : "");
      if (currentValue !== filledValue) return;
      cat.months[idx] = String(change && change.previousValue ? change.previousValue : "");
      restored = true;
    });
    delete recurringUndoByRowId[cat.id];
    return restored;
  }

  function monthGridHeader(i) {
    const loc = resolveLocale(state.locale);
    const row = MONTHS_GRID_HEADER[loc] || MONTHS_GRID_HEADER.en;
    return row[i] != null ? row[i] : MONTHS_GRID_HEADER.en[i];
  }

  function numLocale() {
    const loc = resolveLocale(state.locale);
    if (loc === "ar") return "ar";
    if (loc === "nl") return "nl-NL";
    return "en-US";
  }

  function euroNumberLocale() {
    const loc = resolveLocale(state.locale);
    if (loc === "ar") return "ar";
    if (loc === "nl") return "nl-NL";
    return "de-BE";
  }

  function dateTimeLocale() {
    const loc = resolveLocale(state.locale);
    if (loc === "ar") return "ar";
    if (loc === "nl") return "nl-NL";
    return "en-US";
  }

  function applyDocumentLocale() {
    const loc = resolveLocale(state && state.locale);
    document.documentElement.lang = loc === "ar" ? "ar" : loc === "nl" ? "nl" : "en";
    document.documentElement.dir = loc === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("data-theme", normalizeTheme(state.theme));
    document.title = t("docTitle");
    try {
      const meta = document.querySelector('meta[name="apple-mobile-web-app-title"]');
      if (meta) meta.setAttribute("content", "NAS");
    } catch (_) {}
    try {
      const tc = document.getElementById("meta-theme-color");
      if (tc) {
        const th = normalizeTheme(state.theme);
        if (th === "dark") tc.setAttribute("content", "#15261c");
        else if (th === "paper") tc.setAttribute("content", "#dfd8ce");
        else tc.setAttribute("content", "#2d7a3e");
      }
    } catch (_) {}
  }

  function applyChromeI18n() {
    applyDocumentLocale();
    const ySr = document.getElementById("i18n-year-sr");
    if (ySr) ySr.textContent = t("yearSr");
    const themeSr = document.getElementById("i18n-theme-sr");
    if (themeSr) themeSr.textContent = t("themeSr");
    const themeGreen = document.getElementById("theme-opt-green");
    if (themeGreen) themeGreen.textContent = t("themeGreen");
    const themePaper = document.getElementById("theme-opt-paper");
    if (themePaper) themePaper.textContent = t("themePaper");
    const themeDark = document.getElementById("theme-opt-dark");
    if (themeDark) themeDark.textContent = t("themeDark");
    const cSr = document.getElementById("i18n-currency-sr");
    if (cSr) cSr.textContent = t("currencySr");
    const noneOpt = document.querySelector("#currency option[value='']");
    if (noneOpt) noneOpt.textContent = t("currencyNone");
    const hint = document.getElementById("i18n-hint");
    if (hint) hint.textContent = t("hint") + t("hintComments");
    const pt = document.getElementById("i18n-panel-title");
    if (pt) pt.textContent = t("panelExpenses");
    const billSearchLabel = document.getElementById("i18n-bill-search-label");
    if (billSearchLabel) billSearchLabel.textContent = t("searchBills");
    if (el.billSearch) {
      el.billSearch.setAttribute("aria-label", t("searchBills"));
      el.billSearch.setAttribute("placeholder", t("searchBillsPlaceholder"));
    }
    if (el.billFilters) el.billFilters.setAttribute("aria-label", t("filterGroup"));
    if (el.filterAll) el.filterAll.textContent = t("filterAll");
    if (el.filterHigh) el.filterHigh.textContent = t("filterHighSpending");
    if (el.btnPrint) el.btnPrint.textContent = t("printPdf");
    const addBtn = document.getElementById("btn-add-cat");
    if (addBtn) {
      addBtn.textContent = t("addBill");
      addBtn.setAttribute("title", t("addBillShortcutTitle"));
      addBtn.setAttribute("aria-keyshortcuts", "Control+N Meta+N");
    }
    const exp = document.getElementById("btn-export");
    if (exp) exp.textContent = t("export");
    const imp = document.getElementById("i18n-import-label");
    if (imp) imp.textContent = t("import");
    const thBill = document.getElementById("th-bill");
    if (thBill) {
      thBill.textContent = t("colBill");
      appendHintBadge(thBill, t("billHint"));
    }
    const thTot = document.getElementById("th-total");
    if (thTot) thTot.textContent = t("colTotal");
    const thComLabel = document.getElementById("th-comment-label");
    if (thComLabel) thComLabel.textContent = t("colComment");
    const thAct = document.getElementById("th-actions");
    if (thAct) thAct.setAttribute("aria-label", t("rowActionsSr") + ", " + t("addBill"));
    document.querySelectorAll("th.th-mo[data-mo]").forEach((th) => {
      const i = parseInt(th.getAttribute("data-mo"), 10);
      if (Number.isFinite(i)) {
        th.innerHTML = "";
        const wrap = document.createElement("div");
        wrap.className = "th-mo-wrap";
        const label = document.createElement("span");
        label.className = "th-mo-label";
        label.textContent = monthGridHeader(i);
        wrap.appendChild(label);
        if (i < 11) {
          const actions = document.createElement("div");
          actions.className = "th-mo-actions";
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "month-copy-btn";
          btn.textContent = ">";
          const from = monthName(i);
          const to = monthName(i + 1);
          btn.setAttribute("aria-label", tReplace("duplicateMonthNext", { from, to }));
          btn.setAttribute("title", tReplace("duplicateMonthNext", { from, to }));
          btn.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            duplicateMonthToNext(i);
          });
          actions.appendChild(btn);
          const recurringBtn = document.createElement("button");
          recurringBtn.type = "button";
          recurringBtn.className = "month-recurring-btn";
          recurringBtn.textContent = "R";
          recurringBtn.setAttribute("aria-label", tReplace("recurringCopyNext", { from, to }));
          recurringBtn.setAttribute("title", tReplace("recurringCopyNext", { from, to }) + ". " + t("recurringCopyHint"));
          recurringBtn.addEventListener("click", (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            duplicateRecurringMonthToNext(i);
          });
          actions.appendChild(recurringBtn);
          wrap.appendChild(actions);
        }
        th.appendChild(wrap);
        th.title = monthName(i);
      }
    });
    const cb = document.getElementById("chart-block");
    if (cb) cb.setAttribute("aria-label", t("chartAria"));
    if (el.cellContextCut) el.cellContextCut.textContent = t("contextCut");
    if (el.cellContextCopy) el.cellContextCopy.textContent = t("contextCopy");
    if (el.cellContextPaste) el.cellContextPaste.textContent = t("contextPaste");
    const contextAdd = document.getElementById("cell-context-add-comment");
    if (contextAdd) contextAdd.textContent = t("contextAddComment");
    if (el.cellContextDeleteComment) el.cellContextDeleteComment.textContent = t("contextDeleteComment");
    if (el.btnUndoDelete) el.btnUndoDelete.textContent = t("undoDelete");
    const nl = document.getElementById("i18n-notes-label");
    if (nl) nl.textContent = t("notes");
    const trashTitle = document.getElementById("i18n-trash-title");
    if (trashTitle) trashTitle.textContent = t("trashTitle");
    if (el.btnClearTrash) el.btnClearTrash.textContent = t("clearTrash");
    const backupsTitle = document.getElementById("i18n-backups-title");
    if (backupsTitle) backupsTitle.textContent = t("backupsTitle");
    const yearsTitle = document.getElementById("i18n-years-title");
    if (yearsTitle) yearsTitle.textContent = t("yearsTitle");
    if (el.btnClearBackups) el.btnClearBackups.textContent = t("clearBackups");
    if (el.btnBackupNow) {
      el.btnBackupNow.textContent = t("manualBackup");
      el.btnBackupNow.setAttribute("title", t("manualBackupHint"));
      el.btnBackupNow.setAttribute("aria-label", t("manualBackup"));
    }
    const notes = document.getElementById("notes");
    if (notes) notes.placeholder = t("notesPlaceholder");
    if (el.theme) el.theme.value = normalizeTheme(state.theme);
    if (el.btnResetYear) {
      el.btnResetYear.textContent = t("yearActions");
      el.btnResetYear.setAttribute("aria-label", t("yearActions"));
      el.btnResetYear.setAttribute("title", t("yearActions"));
    }
    if (el.yearActionReset) el.yearActionReset.textContent = t("resetYear");
    if (el.yearActionUndoReset) el.yearActionUndoReset.textContent = t("undoResetYear");
    if (el.yearActionEmptyNext) el.yearActionEmptyNext.textContent = tReplace("emptyNextYear", { year: state.year + 1 });
    if (el.yearActionNamesNext) el.yearActionNamesNext.textContent = tReplace("namesNextYear", { year: state.year + 1 });
    if (el.yearActionRecurringNext) el.yearActionRecurringNext.textContent = tReplace("recurringNextYear", { year: state.year + 1 });
    if (el.yearActionCopyNext) el.yearActionCopyNext.textContent = tReplace("copyToNextYear", { year: state.year + 1 });
    if (el.yearActionUndoReset) el.yearActionUndoReset.disabled = !Boolean(getYearResetUndoSnapshot(state.year));
    if (el.yearActionEmptyNext) el.yearActionEmptyNext.disabled = state.year >= 2100;
    if (el.yearActionNamesNext) el.yearActionNamesNext.disabled = state.year >= 2100;
    if (el.yearActionRecurringNext) el.yearActionRecurringNext.disabled = state.year >= 2100;
    if (el.yearActionCopyNext) el.yearActionCopyNext.disabled = state.year >= 2100;
    const nx = document.getElementById("cell-note-cancel");
    if (nx) {
      nx.setAttribute("aria-label", t("noteCancel"));
      nx.setAttribute("title", t("noteCancel"));
    }
    if (el.yearTemplateEmpty) el.yearTemplateEmpty.textContent = t("yearTemplateEmpty");
    if (el.yearTemplateNames) el.yearTemplateNames.textContent = t("yearTemplateNames");
    if (el.yearTemplateRecurring) el.yearTemplateRecurring.textContent = t("yearTemplateRecurring");
    if (el.yearTemplateFull) el.yearTemplateFull.textContent = t("yearTemplateFull");
    if (el.yearTemplateCancel) {
      el.yearTemplateCancel.setAttribute("aria-label", t("noteCancel"));
      el.yearTemplateCancel.setAttribute("title", t("noteCancel"));
    }
    const lg = document.getElementById("lang-switch");
    if (lg) lg.setAttribute("aria-label", t("langGroup"));
    document.querySelectorAll(".btn-lang").forEach((b) => {
      const loc = b.getAttribute("data-locale");
      b.classList.toggle("is-active", loc === state.locale);
      b.setAttribute("aria-pressed", loc === state.locale ? "true" : "false");
    });
    syncYearTemplateDialogText();
  }

  const el = {
    year: document.getElementById("budget-year"),
    titleBanner: document.getElementById("title-banner"),
    theme: document.getElementById("theme"),
    currency: document.getElementById("currency"),
    gridBody: document.getElementById("grid-body"),
    salaryBlock: document.getElementById("salary-block"),
    footerBlock: document.getElementById("footer-block"),
    chartBlock: document.getElementById("chart-block"),
    notes: document.getElementById("notes"),
    trashList: document.getElementById("trash-list"),
    btnClearTrash: document.getElementById("btn-clear-trash"),
    yearList: document.getElementById("year-list"),
    backupList: document.getElementById("backup-list"),
    btnClearBackups: document.getElementById("btn-clear-backups"),
    btnBackupNow: document.getElementById("btn-backup-now"),
    billSearch: document.getElementById("bill-search"),
    billFilters: document.getElementById("bill-filters"),
    filterAll: document.getElementById("filter-all"),
    filterHigh: document.getElementById("filter-high"),
    trendInsights: document.getElementById("trend-insights"),
    saveStatus: document.getElementById("save-status"),
    btnResetYear: document.getElementById("btn-reset-year"),
    btnPrint: document.getElementById("btn-print"),
    btnAddCat: document.getElementById("btn-add-cat"),
    btnExport: document.getElementById("btn-export"),
    importFile: document.getElementById("import-file"),
    cellContextMenu: document.getElementById("cell-context-menu"),
    cellContextCut: document.getElementById("cell-context-cut"),
    cellContextCopy: document.getElementById("cell-context-copy"),
    cellContextPaste: document.getElementById("cell-context-paste"),
    cellContextAddComment: document.getElementById("cell-context-add-comment"),
    cellContextDeleteComment: document.getElementById("cell-context-delete-comment"),
    yearActionsMenu: document.getElementById("year-actions-menu"),
    yearActionReset: document.getElementById("year-action-reset"),
    yearActionUndoReset: document.getElementById("year-action-undo-reset"),
    yearActionEmptyNext: document.getElementById("year-action-empty-next"),
    yearActionNamesNext: document.getElementById("year-action-names-next"),
    yearActionRecurringNext: document.getElementById("year-action-recurring-next"),
    yearActionCopyNext: document.getElementById("year-action-copy-next"),
    yearTemplateDialog: document.getElementById("year-template-dialog"),
    yearTemplateTitle: document.getElementById("year-template-title"),
    yearTemplateText: document.getElementById("year-template-text"),
    yearTemplateEmpty: document.getElementById("year-template-empty"),
    yearTemplateNames: document.getElementById("year-template-names"),
    yearTemplateRecurring: document.getElementById("year-template-recurring"),
    yearTemplateFull: document.getElementById("year-template-full"),
    yearTemplateCancel: document.getElementById("year-template-cancel"),
    btnUndoDelete: document.getElementById("btn-undo-delete"),
  };

  let state = defaultState();
  let saveDebounceTimer = null;
  let saveStatusTimer = null;
  let cellContextAction = null;
  let pendingRowUndo = null;
  let pendingUndoTimer = null;
  let billSearchQuery = "";
  let rowFilterMode = "all";
  let backups = [];
  let lastBackupAt = 0;
  const recurringUndoByRowId = Object.create(null);
  let yearResetUndo = Object.create(null);

  function normalizedSearch(text) {
    return String(text || "").trim().toLocaleLowerCase(resolveLocale(state.locale));
  }

  function normalizeTagColor(tagColor) {
    const key = String(tagColor || "");
    return TAG_COLORS.some((entry) => entry.key === key) ? key : "";
  }

  function tagColorValue(tagColor) {
    const key = normalizeTagColor(tagColor);
    const match = TAG_COLORS.find((entry) => entry.key === key);
    return match ? match.color : TAG_COLORS[0].color;
  }

  function hexToRgba(hex, alpha) {
    const raw = String(hex || "").replace("#", "").trim();
    const normalized = raw.length === 3
      ? raw.split("").map((ch) => ch + ch).join("")
      : raw;
    if (!/^[\da-f]{6}$/i.test(normalized)) return "rgba(203, 213, 225, " + alpha + ")";
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  }

  function nextTagColor(tagColor) {
    const key = normalizeTagColor(tagColor);
    const idx = TAG_COLORS.findIndex((entry) => entry.key === key);
    return TAG_COLORS[(idx + 1 + TAG_COLORS.length) % TAG_COLORS.length].key;
  }

  function tagColorLabel(tagColor) {
    const key = normalizeTagColor(tagColor);
    if (key === "green") return t("tagColorGreen");
    if (key === "blue") return t("tagColorBlue");
    if (key === "orange") return t("tagColorOrange");
    if (key === "purple") return t("tagColorPurple");
    if (key === "rose") return t("tagColorRose");
    return t("tagColorNone");
  }

  function highSpendingThreshold() {
    const totals = state.categories.map((cat) => rowTotal(cat)).filter((value) => value > 0);
    if (!totals.length) return Number.POSITIVE_INFINITY;
    const avg = totals.reduce((sum, value) => sum + value, 0) / totals.length;
    return Math.max(500, avg * 1.25);
  }

  function matchesRowFilter(cat) {
    if (rowFilterMode === "high") return rowTotal(cat) >= highSpendingThreshold();
    return true;
  }

  function syncFilterButtons() {
    if (!el.billFilters) return;
    el.billFilters.querySelectorAll(".panel-filter-chip").forEach((btn) => {
      const active = btn.getAttribute("data-filter") === rowFilterMode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function renderTrendInsights(colTot, salaryRow) {
    if (!el.trendInsights) return;
    el.trendInsights.innerHTML = "";
    const highestIdx = colTot.reduce((best, value, idx, arr) => (value > arr[best] ? idx : best), 0);
    const lowestIdx = colTot.reduce((best, value, idx, arr) => (value < arr[best] ? idx : best), 0);
    const average = colTot.reduce((sum, value) => sum + value, 0) / Math.max(colTot.length, 1);
    const remaining = colTot.map((value, idx) => salaryRow[idx] - value);
    const bestBalanceIdx = remaining.reduce((best, value, idx, arr) => (value > arr[best] ? idx : best), 0);
    const items = [
      { label: t("trendHighest"), month: monthName(highestIdx), value: formatMoney(colTot[highestIdx], state.currency) },
      { label: t("trendLowest"), month: monthName(lowestIdx), value: formatMoney(colTot[lowestIdx], state.currency) },
      { label: t("trendAverage"), month: null, value: formatMoney(average, state.currency) },
      { label: t("trendBestBalance"), month: monthName(bestBalanceIdx), value: formatMoney(remaining[bestBalanceIdx], state.currency) },
    ];
    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "trend-card";
      const label = document.createElement("div");
      label.className = "trend-card-label";
      label.textContent = item.label;
      const value = document.createElement("div");
      value.className = "trend-card-value";
      value.textContent = item.value;
      card.appendChild(label);
      if (item.month) {
        const month = document.createElement("div");
        month.className = "trend-card-month";
        month.textContent = item.month;
        card.appendChild(month);
      }
      card.appendChild(value);
      el.trendInsights.appendChild(card);
    });
  }

  function parseNum(s) {
    if (s == null) return 0;
    const t = String(s).trim();
    if (t === "" || t === "-" || t === "—" || t === "!") return 0;
    const n = parseFloat(t.replace(/[$€£]/g, "").replace(/,/g, "").replace(/\s/g, ""));
    return Number.isFinite(n) ? n : 0;
  }

  function parseCsvRow(line) {
    const cells = [];
    let cur = "";
    let i = 0;
    let inQuotes = false;
    while (i < line.length) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') {
            cur += '"';
            i += 2;
            continue;
          }
          inQuotes = false;
          i++;
          continue;
        }
        cur += ch;
        i++;
        continue;
      }
      if (ch === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (ch === ",") {
        cells.push(cur);
        cur = "";
        i++;
        continue;
      }
      cur += ch;
      i++;
    }
    cells.push(cur);
    return cells;
  }

  function sheetCellToInput(v) {
    if (v == null) return "";
    let t = String(v).trim();
    if (t === "" || t === "-" || t === "—" || t === "!") return "";
    t = t.replace(/[$€£]/g, "").replace(/,/g, "").replace(/\s/g, "");
    const n = parseFloat(t);
    if (!Number.isFinite(n) || n === 0) return "";
    return String(n);
  }

  function importGoogleBudgetCsv(text) {
    text = String(text || "").replace(/^\uFEFF/, "");
    const lines = text.split(/\r?\n/).filter((ln) => ln.length > 0);
    if (lines.length < 3) return null;

    let headerIdx = -1;
    let monthStart = -1;
    for (let i = 0; i < Math.min(lines.length, 8); i++) {
      const c = parseCsvRow(lines[i]);
      const j = c.findIndex((x) => /^january$/i.test(String(x).trim()));
      if (j >= 0) {
        headerIdx = i;
        monthStart = j;
        break;
      }
    }
    if (headerIdx < 0 || monthStart < 0) return null;

    let year = new Date().getFullYear();
    for (let i = 0; i <= headerIdx; i++) {
      const m = lines[i].match(/Budget\s+(20\d{2})/i);
      if (m) year = parseInt(m[1], 10);
    }

    let currency = "$";
    if (!/\$/.test(text) && /€/.test(text)) currency = "€";
    else if (/£/.test(text) && !/\$/.test(text)) currency = "£";

    const categories = [];
    let salary = emptyMonths();
    let salaryRowComment = "";

    for (let r = headerIdx + 1; r < lines.length; r++) {
      const row = parseCsvRow(lines[r]);
      const c0 = String(row[0] || "").trim();
      const c1 = String(row[1] || "").trim();
      if (/^total$/i.test(c0)) break;

      const moSlice = row.slice(monthStart, monthStart + 12);
      const moEmpty = moSlice.every((x) => !String(x || "").trim());
      if (!c0 && !c1 && moEmpty) continue;
      if (!c0 && !c1) continue;

      const mo = [];
      for (let k = 0; k < 12; k++) mo.push(sheetCellToInput(row[monthStart + k]));
      const rowComment = String(row[monthStart + 13] || "").trim();

      if (!c0 && /^(salary|selary)$/i.test(c1)) {
        salary = padString12(mo);
        salaryRowComment = rowComment;
        continue;
      }

      if (c0) {
        categories.push({
          id: uid(),
          name: c0,
          ref: c1 || "",
          months: padString12(mo),
          comments: emptyMonths(),
          rowComment,
          tagColor: "",
          locked: false,
          recurring: false,
        });
      }
    }

    if (!categories.length) return null;
    return { year, salary, categories, currency, salaryRowComment };
  }

  function formatMoney(n, currency) {
    const abs = Math.abs(n);
    const sym = currency || "";
    const nl = numLocale();
    if (sym === "$") {
      const s = abs.toLocaleString(nl, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return (n < 0 ? "-" : "") + sym + s;
    }
    if (sym === "€" || sym === "£") {
      const s = abs.toLocaleString(euroNumberLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return (n < 0 ? "-" : "") + s + " " + sym;
    }
    const s = abs.toLocaleString(nl, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (n < 0 ? "-" : "") + (sym ? sym : "") + s;
  }

  function rowTotal(cat) {
    return cat.months.reduce((a, m) => a + parseNum(m), 0);
  }

  function columnTotals() {
    const col = Array(12).fill(0);
    for (const c of state.categories) {
      for (let i = 0; i < 12; i++) col[i] += parseNum(c.months[i]);
    }
    return col;
  }

  function grandTotalExpense() {
    return columnTotals().reduce((a, b) => a + b, 0);
  }

  function salaryTotalMonth(i) {
    return parseNum(state.salary[i]);
  }

  function load() {
    loadBackups();
    loadYearResetUndo();
    try {
      const activeYear = parseInt(localStorage.getItem(ACTIVE_YEAR_KEY) || "", 10);
      if (Number.isFinite(activeYear)) {
        const savedForYear = localStorage.getItem(storageKeyForYear(activeYear));
        if (savedForYear) {
          state = normalizeState(JSON.parse(savedForYear));
          return;
        }
      }
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && d.version === 2) {
          state = normalizeState(d);
          return;
        }
      }
      const leg = localStorage.getItem(LEGACY_KEY);
      if (leg) {
        const d = JSON.parse(leg);
        state = migrateV1(d);
        scheduleSave();
        return;
      }
    } catch (_) {}
    state = defaultState();
  }

  function normalizeState(d) {
    const base = defaultState();
    const y = typeof d.year === "number" ? d.year : base.year;
    let cats = Array.isArray(d.categories)
      ? d.categories.map((c) => ({
          id: c.id || uid(),
          name: String(c.name || ""),
          ref: String(c.ref || ""),
          months: padString12(c.months),
          comments: padString12(c.comments),
          rowComment: c.rowComment != null ? String(c.rowComment) : "",
          tagColor: c.tagColor != null ? String(c.tagColor) : "",
          locked: Boolean(c.locked),
          recurring: Boolean(c.recurring),
        }))
      : base.categories.slice();
    if (!cats.length) {
      cats = defaultStarterCategories();
    }
    const sal = padString12(d.salary);
    const salCom = padString12(d.salaryComments);
    const loc = typeof d.locale === "string" && SUPPORTED_LOCALES.includes(d.locale) ? d.locale : browserDefaultLocale();
    return {
      version: 2,
      locale: loc,
      theme: normalizeTheme(d.theme),
      year: y,
      currency: d.currency != null ? String(d.currency) : base.currency,
      categories: cats,
      salary: sal,
      salaryComments: salCom,
      salaryRowComment: d.salaryRowComment != null ? String(d.salaryRowComment) : "",
      notes: d.notes != null ? String(d.notes) : "",
      trash: Array.isArray(d.trash)
        ? d.trash.map((item) => ({
            trashId: item.trashId || uid(),
            index: Number.isFinite(item.index) ? item.index : 0,
            row: cloneCategory(item.row || {}),
            deletedAt: item.deletedAt != null ? String(item.deletedAt) : "",
          }))
        : [],
    };
  }

  function migrateV1(d) {
    const s = defaultState();
    if (!d || !Array.isArray(d.expenses)) return s;
    const rows = d.expenses.filter((e) => e && String(e.description || "").trim());
    s.year = typeof d.year === "number" ? d.year : s.year;
    s.theme = "green";
    s.currency = d.currency != null ? String(d.currency) : s.currency;
    s.notes = d.notes != null ? String(d.notes) : "";
    s.categories = rows.map((e) => {
      const m = Array(12).fill("");
      const amt = parseNum(e.amount);
      if (amt) m[0] = String(amt);
      return { id: uid(), name: String(e.description || ""), ref: "", months: m, comments: emptyMonths(), rowComment: "", tagColor: "", locked: false, recurring: false };
    });
    if (!s.categories.length) {
      s.categories = defaultStarterCategories();
    }
    const inc = Array.isArray(d.income) ? d.income : [];
    const incSum = inc.reduce((a, x) => a + parseNum(x && x.amount), 0);
    if (incSum) s.salary[0] = String(incSum);
    s.trash = [];
    return s;
  }

  function persist() {
    try {
      localStorage.setItem(storageKeyForYear(state.year), JSON.stringify(state));
      localStorage.setItem(ACTIVE_YEAR_KEY, String(state.year));
      maybeCreateBackup();
      el.saveStatus.textContent = t("saved");
      clearTimeout(saveStatusTimer);
      saveStatusTimer = setTimeout(() => {
        el.saveStatus.textContent = "";
      }, 2000);
    } catch (e) {
      el.saveStatus.textContent = t("couldNotSave");
    }
  }

  function scheduleSave() {
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(persist, SAVE_DEBOUNCE_MS);
  }

  function loadYearState(year) {
    if (!Number.isFinite(year)) return null;
    try {
      const raw = localStorage.getItem(storageKeyForYear(year));
      if (!raw) return null;
      return normalizeState(JSON.parse(raw));
    } catch (_) {
      return null;
    }
  }

  function switchToYear(year) {
    const loaded = loadYearState(year);
    if (!loaded) return false;
    state = loaded;
    resetTransientUiState();
    try {
      localStorage.setItem(ACTIVE_YEAR_KEY, String(state.year));
    } catch (_) {}
    renderAll();
    return true;
  }

  function listSavedYears() {
    const byYear = new Map();
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const match = key && key.match(/^nas-budget-v2-year-(\d{4})$/);
        if (!match) continue;
        const year = parseInt(match[1], 10);
        if (!Number.isFinite(year)) continue;
        const loaded = loadYearState(year);
        if (loaded) byYear.set(year, loaded);
      }
    } catch (_) {}
    byYear.set(state.year, normalizeState(state));
    return Array.from(byYear.entries())
      .sort((a, b) => b[0] - a[0])
      .map((entry) => entry[1]);
  }

  function resetTransientUiState() {
    pendingRowUndo = null;
    clearTimeout(pendingUndoTimer);
    pendingUndoTimer = null;
    billSearchQuery = "";
    rowFilterMode = "all";
    hideYearActionsMenu();
    Object.keys(recurringUndoByRowId).forEach((key) => delete recurringUndoByRowId[key]);
    if (el.billSearch) el.billSearch.value = "";
  }

  function flashSaveStatus(message) {
    if (!el.saveStatus) return;
    el.saveStatus.textContent = message || "";
    clearTimeout(saveStatusTimer);
    saveStatusTimer = setTimeout(() => {
      el.saveStatus.textContent = "";
    }, 2000);
  }

  function persistYearResetUndo() {
    try {
      localStorage.setItem(YEAR_RESET_UNDO_KEY, JSON.stringify(yearResetUndo));
    } catch (_) {}
  }

  function loadYearResetUndo() {
    try {
      const raw = localStorage.getItem(YEAR_RESET_UNDO_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      yearResetUndo = parsed && typeof parsed === "object" ? parsed : Object.create(null);
    } catch (_) {
      yearResetUndo = Object.create(null);
    }
  }

  function getYearResetUndoSnapshot(year) {
    if (!Number.isFinite(year)) return "";
    return typeof yearResetUndo[String(year)] === "string" ? yearResetUndo[String(year)] : "";
  }

  function setYearResetUndoSnapshot(year, snapshot) {
    if (!Number.isFinite(year) || !snapshot) return;
    yearResetUndo[String(year)] = snapshot;
    persistYearResetUndo();
  }

  function clearYearResetUndoSnapshot(year) {
    if (!Number.isFinite(year)) return;
    delete yearResetUndo[String(year)];
    persistYearResetUndo();
  }

  function resetCurrentYear() {
    if (!window.confirm(t("resetYearConfirm"))) return;
    clearTimeout(saveDebounceTimer);
    setYearResetUndoSnapshot(state.year, stateSnapshot());
    createBackup("reset-year");
    state = emptyTemplateState(state.year, state);
    state.theme = "green";
    resetTransientUiState();
    persist();
    renderAll();
    flashSaveStatus(t("yearReset"));
  }

  function undoResetCurrentYear() {
    const snapshot = getYearResetUndoSnapshot(state.year);
    if (!snapshot) {
      flashSaveStatus(t("noYearResetUndo"));
      return;
    }
    clearTimeout(saveDebounceTimer);
    createBackup("undo-reset-year");
    try {
      state = normalizeState(JSON.parse(snapshot));
      clearYearResetUndoSnapshot(state.year);
      resetTransientUiState();
      persist();
      renderAll();
      flashSaveStatus(t("yearResetUndone"));
    } catch (_) {
      flashSaveStatus(t("couldNotSave"));
    }
  }

  function openNextYearFromCurrent(mode) {
    const nextYear = state.year + 1;
    if (nextYear > 2100) {
      flashSaveStatus(t("maxYearReached"));
      return;
    }
    const confirmKey = mode === "empty"
      ? "emptyNextYearConfirm"
      : mode === "names"
        ? "namesNextYearConfirm"
        : mode === "recurring"
          ? "recurringNextYearConfirm"
        : "copyToNextYearConfirm";
    const ok = window.confirm(tReplace(confirmKey, { from: state.year, to: nextYear, year: nextYear }));
    if (!ok) return;
    clearTimeout(saveDebounceTimer);
    persist();
    const existingSnapshot = localStorage.getItem(storageKeyForYear(nextYear));
    if (existingSnapshot) createBackupFromSnapshot(existingSnapshot, "copy-next-year-overwrite");
    const nextState = mode === "empty"
      ? emptyTemplateState(nextYear, state)
      : mode === "names"
        ? namesTemplateState(nextYear, state)
        : mode === "recurring"
          ? recurringTemplateState(nextYear, state)
        : fullYearTemplateState(nextYear, state);
    if (mode === "empty") nextState.theme = "green";
    try {
      localStorage.setItem(storageKeyForYear(nextYear), JSON.stringify(nextState));
      localStorage.setItem(ACTIVE_YEAR_KEY, String(nextYear));
      state = nextState;
      resetTransientUiState();
      renderAll();
      flashSaveStatus(
        mode === "empty"
          ? t("emptyYearOpened")
          : mode === "names"
            ? t("namesCopiedToNext")
            : mode === "recurring"
              ? t("recurringCopiedToNext")
            : t("yearCopiedToNext")
      );
    } catch (_) {
      flashSaveStatus(t("couldNotSave"));
    }
  }

  function cloneCategory(cat) {
    return {
      id: cat.id || uid(),
      name: String(cat.name || ""),
      ref: String(cat.ref || ""),
      months: padString12(cat.months),
      comments: padString12(cat.comments),
      rowComment: cat.rowComment != null ? String(cat.rowComment) : "",
      tagColor: cat.tagColor != null ? String(cat.tagColor) : "",
      locked: Boolean(cat.locked),
      recurring: Boolean(cat.recurring),
    };
  }

  function stateSnapshot() {
    return JSON.stringify(state);
  }

  function loadBackups() {
    try {
      const raw = localStorage.getItem(BACKUP_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      backups = Array.isArray(parsed) ? parsed.filter((item) => item && item.snapshot).slice(0, MAX_BACKUPS) : [];
      lastBackupAt = backups.length ? Date.parse(backups[0].createdAt || "") || 0 : 0;
    } catch (_) {
      backups = [];
      lastBackupAt = 0;
    }
  }

  function persistBackups() {
    try {
      localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(backups));
    } catch (_) {}
  }

  function createBackupFromSnapshot(snapshot, reason) {
    if (!snapshot) return;
    const now = new Date();
    backups = Array.isArray(backups) ? backups : [];
    const reasonNorm = reason || "auto";
    if (reasonNorm !== "manual" && backups[0] && backups[0].snapshot === snapshot) {
      lastBackupAt = Date.parse(backups[0].createdAt || "") || Date.now();
      return;
    }
    backups.unshift({
      id: uid(),
      createdAt: now.toISOString(),
      reason: reasonNorm,
      snapshot,
    });
    backups = backups.slice(0, MAX_BACKUPS);
    lastBackupAt = now.getTime();
    persistBackups();
  }

  function createBackup(reason) {
    createBackupFromSnapshot(stateSnapshot(), reason);
  }

  function maybeCreateBackup() {
    const now = Date.now();
    if (!backups.length || now - lastBackupAt >= BACKUP_MIN_INTERVAL_MS) {
      createBackup("auto");
    } else {
      persistBackups();
    }
  }

  function formatBackupTime(iso) {
    const d = new Date(iso);
    if (!Number.isFinite(d.getTime())) return "";
    return d.toLocaleString(dateTimeLocale(), {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function backupReasonLabel(reason) {
    if (reason === "auto") return t("backupReasonAuto");
    if (reason === "manual") return t("backupReasonManual");
    if (reason === "reset-year") return t("backupReasonResetYear");
    if (reason === "undo-reset-year") return t("backupReasonUndoResetYear");
    if (reason === "pre-restore") return t("backupReasonPreRestore");
    if (reason === "copy-next-year-overwrite") return t("backupReasonOverwriteNextYear");
    return t("backupReasonUnknown");
  }

  function truncatePreview(text, maxLength) {
    const trimmed = String(text || "").trim().replace(/\s+/g, " ");
    if (!trimmed) return "";
    if (!Number.isFinite(maxLength) || trimmed.length <= maxLength) return trimmed;
    return trimmed.slice(0, Math.max(0, maxLength - 1)).trimEnd() + "…";
  }

  function renderYearOverview() {
    if (!el.yearList) return;
    el.yearList.innerHTML = "";
    const years = listSavedYears();
    if (!years.length) {
      const empty = document.createElement("p");
      empty.className = "year-empty";
      empty.textContent = t("yearsEmpty");
      el.yearList.appendChild(empty);
      return;
    }
    years.forEach((yearState) => {
      const wrap = document.createElement("div");
      wrap.className = "year-item";
      const isCurrent = yearState.year === state.year;
      wrap.classList.toggle("is-current", isCurrent);

      const meta = document.createElement("div");
      meta.className = "year-item-meta";

      const titleRow = document.createElement("div");
      titleRow.className = "year-item-title-row";
      const title = document.createElement("div");
      title.className = "year-item-name";
      title.textContent = String(yearState.year);
      titleRow.appendChild(title);
      if (isCurrent) {
        const badge = document.createElement("span");
        badge.className = "year-item-badge";
        badge.textContent = t("currentYear");
        titleRow.appendChild(badge);
      }

      const detail = document.createElement("div");
      detail.className = "year-item-detail";
      detail.textContent = tReplace("yearBillsCount", { count: yearState.categories.length });

      const salaryTotal = padString12(yearState.salary).reduce((sum, _, i) => sum + parseNum(yearState.salary[i]), 0);
      const spendingTotal = yearState.categories.reduce((sum, cat) => sum + rowTotal(cat), 0);
      const remainingTotal = salaryTotal - spendingTotal;

      const stats = document.createElement("div");
      stats.className = "year-item-stats";
      [tReplace("yearSalaryTotal", { amount: formatMoney(salaryTotal, yearState.currency) }),
        tReplace("yearExpenseTotal", { amount: formatMoney(spendingTotal, yearState.currency) }),
        tReplace("yearRemainingTotal", { amount: formatMoney(remainingTotal, yearState.currency) })].forEach((text) => {
        const stat = document.createElement("span");
        stat.className = "year-item-stat";
        stat.textContent = text;
        stats.appendChild(stat);
      });

      meta.appendChild(titleRow);
      meta.appendChild(detail);
      const notePreview = truncatePreview(yearState.notes, 72);
      if (notePreview) {
        const note = document.createElement("div");
        note.className = "year-item-note";
        note.textContent = tReplace("yearNoteLabel", { text: notePreview });
        meta.appendChild(note);
      }
      meta.appendChild(stats);

      const actions = document.createElement("div");
      actions.className = "year-item-actions";
      const openBtn = document.createElement("button");
      openBtn.type = "button";
      openBtn.className = "btn btn-ghost btn-small";
      openBtn.textContent = isCurrent ? t("currentYear") : t("openYear");
      openBtn.disabled = isCurrent;
      openBtn.addEventListener("click", () => {
        clearTimeout(saveDebounceTimer);
        persist();
        switchToYear(yearState.year);
      });
      actions.appendChild(openBtn);

      wrap.appendChild(meta);
      wrap.appendChild(actions);
      el.yearList.appendChild(wrap);
    });
  }

  function restoreBackup(backupId) {
    const item = backups.find((entry) => entry.id === backupId);
    if (!item) return;
    if (!window.confirm(t("backupRestoreConfirm"))) return;
    createBackup("pre-restore");
    try {
      const parsed = JSON.parse(item.snapshot);
      state = normalizeState(parsed);
      clearPendingRowUndo();
      scheduleSave();
      renderAll();
      el.saveStatus.textContent = t("backupRestored");
    } catch (_) {
      el.saveStatus.textContent = t("couldNotSave");
    }
  }

  function renderBackupHistory() {
    if (!el.backupList) return;
    el.backupList.innerHTML = "";
    if (!backups.length) {
      const empty = document.createElement("p");
      empty.className = "backup-empty";
      empty.textContent = t("backupsEmpty");
      el.backupList.appendChild(empty);
      if (el.btnClearBackups) el.btnClearBackups.disabled = true;
      return;
    }
    if (el.btnClearBackups) el.btnClearBackups.disabled = false;
    backups.forEach((item) => {
      const wrap = document.createElement("div");
      wrap.className = "backup-item";
      const meta = document.createElement("div");
      meta.className = "backup-item-meta";
      const title = document.createElement("div");
      title.className = "backup-item-name";
      title.textContent = backupReasonLabel(item.reason);
      const detail = document.createElement("div");
      detail.className = "backup-item-detail";
      detail.textContent = formatBackupTime(item.createdAt);
      meta.appendChild(title);
      meta.appendChild(detail);
      const actions = document.createElement("div");
      actions.className = "backup-item-actions";
      const restoreBtn = document.createElement("button");
      restoreBtn.type = "button";
      restoreBtn.className = "btn btn-ghost btn-small";
      restoreBtn.textContent = t("backupRestore");
      restoreBtn.addEventListener("click", () => restoreBackup(item.id));
      actions.appendChild(restoreBtn);
      wrap.appendChild(meta);
      wrap.appendChild(actions);
      el.backupList.appendChild(wrap);
    });
  }

  function addRowToTrash(cat, index) {
    const item = {
      trashId: uid(),
      index,
      row: cloneCategory(cat),
      deletedAt: new Date().toISOString(),
    };
    state.trash = Array.isArray(state.trash) ? state.trash.slice() : [];
    state.trash.unshift(item);
    state.trash = state.trash.slice(0, 25);
    return item;
  }

  function removeTrashItem(trashId) {
    state.trash = (Array.isArray(state.trash) ? state.trash : []).filter((item) => item.trashId !== trashId);
  }

  function restoreTrashItem(trashId) {
    const items = Array.isArray(state.trash) ? state.trash : [];
    const item = items.find((entry) => entry.trashId === trashId);
    if (!item) return;
    if (state.categories.length === 1 && isEmptyCategoryRow(state.categories[0])) {
      state.categories = [];
    }
    const insertAt = Math.max(0, Math.min(item.index, state.categories.length));
    state.categories.splice(insertAt, 0, cloneCategory(item.row));
    removeTrashItem(trashId);
    clearPendingRowUndo();
    scheduleSave();
    renderAll();
  }

  function renderTrashBin() {
    if (!el.trashList) return;
    el.trashList.innerHTML = "";
    const items = Array.isArray(state.trash) ? state.trash : [];
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "trash-empty";
      empty.textContent = t("trashEmpty");
      el.trashList.appendChild(empty);
      if (el.btnClearTrash) el.btnClearTrash.disabled = true;
      return;
    }
    if (el.btnClearTrash) el.btnClearTrash.disabled = false;
    items.forEach((item) => {
      const row = item.row || {};
      const wrap = document.createElement("div");
      wrap.className = "trash-item";
      const meta = document.createElement("div");
      meta.className = "trash-item-meta";
      const name = document.createElement("div");
      name.className = "trash-item-name";
      name.textContent = String(row.name || t("colBill"));
      const detail = document.createElement("div");
      detail.className = "trash-item-detail";
      detail.textContent = formatMoney(rowTotal(row), state.currency);
      meta.appendChild(name);
      meta.appendChild(detail);
      const actions = document.createElement("div");
      actions.className = "trash-item-actions";
      const restoreBtn = document.createElement("button");
      restoreBtn.type = "button";
      restoreBtn.className = "btn btn-ghost btn-small";
      restoreBtn.textContent = t("restoreRow");
      restoreBtn.addEventListener("click", () => restoreTrashItem(item.trashId));
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "btn btn-ghost btn-small trash-delete-btn";
      deleteBtn.textContent = t("deleteForever");
      deleteBtn.addEventListener("click", () => {
        removeTrashItem(item.trashId);
        scheduleSave();
        renderTrashBin();
      });
      actions.appendChild(restoreBtn);
      actions.appendChild(deleteBtn);
      wrap.appendChild(meta);
      wrap.appendChild(actions);
      el.trashList.appendChild(wrap);
    });
  }

  function isEmptyCategoryRow(cat) {
    if (!cat) return false;
    if (String(cat.name || "").trim()) return false;
    if (String(cat.ref || "").trim()) return false;
    if (String(cat.rowComment || "").trim()) return false;
    if (cat.locked) return false;
    if (cat.recurring) return false;
    if (padString12(cat.months).some((x) => String(x || "").trim())) return false;
    if (padString12(cat.comments).some((x) => String(x || "").trim())) return false;
    return true;
  }

  function clearPendingRowUndo() {
    pendingRowUndo = null;
    clearTimeout(pendingUndoTimer);
    pendingUndoTimer = null;
    if (el.btnUndoDelete) el.btnUndoDelete.hidden = true;
  }

  function queueRowUndo(payload, statusKey) {
    pendingRowUndo = payload;
    if (el.btnUndoDelete) el.btnUndoDelete.hidden = false;
    el.saveStatus.textContent = t(statusKey);
    clearTimeout(pendingUndoTimer);
    pendingUndoTimer = setTimeout(() => {
      clearPendingRowUndo();
      if (el.saveStatus.textContent === t(statusKey)) el.saveStatus.textContent = "";
    }, 7000);
  }

  function queueDeletedRowUndo(cat, index) {
    const trashItem = addRowToTrash(cat, index);
    queueRowUndo(
      {
        type: "delete",
        index,
        row: cloneCategory(cat),
        trashId: trashItem.trashId,
      },
      "rowDeleted"
    );
  }

  function queueAddedRowUndo(cat, index) {
    queueRowUndo(
      {
        type: "add",
        index,
        rowId: cat.id,
      },
      "rowAdded"
    );
  }

  function addNewBillRow() {
    const newRow = { id: uid(), name: "", ref: "", months: emptyMonths(), comments: emptyMonths(), rowComment: "", tagColor: "", locked: false, recurring: false };
    state.categories.push(newRow);
    queueAddedRowUndo(newRow, state.categories.length - 1);
    scheduleSave();
    renderAll();
  }

  function undoLastRowAction() {
    if (!pendingRowUndo) return;
    if (pendingRowUndo.type === "delete") {
      if (state.categories.length === 1 && isEmptyCategoryRow(state.categories[0])) {
        state.categories = [];
      }
      const insertAt = Math.max(0, Math.min(pendingRowUndo.index, state.categories.length));
      state.categories.splice(insertAt, 0, cloneCategory(pendingRowUndo.row));
      if (pendingRowUndo.trashId) removeTrashItem(pendingRowUndo.trashId);
    } else if (pendingRowUndo.type === "add") {
      state.categories = state.categories.filter((c) => c.id !== pendingRowUndo.rowId);
      if (!state.categories.length) {
        state.categories.push({ id: uid(), name: "", ref: "", months: emptyMonths(), comments: emptyMonths(), rowComment: "", tagColor: "", locked: false, recurring: false });
      }
    }
    clearPendingRowUndo();
    scheduleSave();
    renderAll();
  }

  function isTypingTarget(target) {
    if (!target || typeof target.closest !== "function") return false;
    return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
  }

  function syncFormFromState() {
    el.year.value = String(state.year);
    el.titleBanner.textContent = tReplace("budgetBanner", { year: state.year });
    el.currency.value = state.currency;
    el.notes.value = state.notes;
  }

  function updateStickyRowOffsets() {
    const table = document.getElementById("budget-table");
    const headerRow = table ? table.querySelector("thead tr") : null;
    const headerHeight = headerRow ? Math.ceil(headerRow.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty("--budget-sticky-header-height", headerHeight + "px");
  }

  let noteApply = null;
  let noteAnchorEl = null;
  let pendingYearTemplateTarget = null;
  let pendingYearTemplateSource = null;
  let cellContextActions = null;

  async function writeClipboardText(text) {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(String(text || ""));
        return true;
      }
    } catch (_) {}
    try {
      const ta = document.createElement("textarea");
      ta.value = String(text || "");
      ta.setAttribute("readonly", "readonly");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      ta.style.pointerEvents = "none";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (_) {
      return false;
    }
  }

  async function readClipboardText() {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.readText === "function") {
        return await navigator.clipboard.readText();
      }
    } catch (_) {}
    return null;
  }

  function hideYearActionsMenu() {
    if (!el.yearActionsMenu) return;
    el.yearActionsMenu.hidden = true;
    el.yearActionsMenu.style.left = "";
    el.yearActionsMenu.style.top = "";
  }

  function showYearActionsMenu() {
    if (!el.yearActionsMenu || !el.btnResetYear) return;
    if (el.yearActionUndoReset) el.yearActionUndoReset.disabled = !Boolean(getYearResetUndoSnapshot(state.year));
    if (el.yearActionEmptyNext) el.yearActionEmptyNext.textContent = tReplace("emptyNextYear", { year: state.year + 1 });
    if (el.yearActionNamesNext) el.yearActionNamesNext.textContent = tReplace("namesNextYear", { year: state.year + 1 });
    if (el.yearActionRecurringNext) el.yearActionRecurringNext.textContent = tReplace("recurringNextYear", { year: state.year + 1 });
    if (el.yearActionCopyNext) el.yearActionCopyNext.textContent = tReplace("copyToNextYear", { year: state.year + 1 });
    if (el.yearActionEmptyNext) el.yearActionEmptyNext.disabled = state.year >= 2100;
    if (el.yearActionNamesNext) el.yearActionNamesNext.disabled = state.year >= 2100;
    if (el.yearActionRecurringNext) el.yearActionRecurringNext.disabled = state.year >= 2100;
    if (el.yearActionCopyNext) el.yearActionCopyNext.disabled = state.year >= 2100;
    el.yearActionsMenu.hidden = false;
    const margin = 8;
    const btnRect = el.btnResetYear.getBoundingClientRect();
    const menuRect = el.yearActionsMenu.getBoundingClientRect();
    const maxLeft = Math.max(margin, window.innerWidth - menuRect.width - margin);
    const maxTop = Math.max(margin, window.innerHeight - menuRect.height - margin);
    const left = Math.min(btnRect.left, maxLeft);
    const top = Math.min(btnRect.bottom + 8, maxTop);
    el.yearActionsMenu.style.left = left + "px";
    el.yearActionsMenu.style.top = top + "px";
    if (el.yearActionReset) el.yearActionReset.focus();
  }

  function toggleYearActionsMenu(ev) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    if (!el.yearActionsMenu) return;
    if (el.yearActionsMenu.hidden) {
      showYearActionsMenu();
    } else {
      hideYearActionsMenu();
    }
  }

  function syncYearTemplateDialogText() {
    if (!el.yearTemplateDialog || !Number.isFinite(pendingYearTemplateTarget)) return;
    if (el.yearTemplateTitle) el.yearTemplateTitle.textContent = tReplace("yearTemplateTitle", { year: pendingYearTemplateTarget });
    if (el.yearTemplateText) el.yearTemplateText.textContent = t("yearTemplateText");
  }

  function closeYearTemplateDialog() {
    pendingYearTemplateTarget = null;
    pendingYearTemplateSource = null;
    if (el.yearTemplateDialog) el.yearTemplateDialog.hidden = true;
    if (el.year.value) el.year.value = String(state.year);
  }

  function applyYearTemplateChoice(mode) {
    if (!Number.isFinite(pendingYearTemplateTarget)) {
      closeYearTemplateDialog();
      return;
    }
    const targetYear = pendingYearTemplateTarget;
    const sourceState = pendingYearTemplateSource || state;
    if (mode === "names") {
      state = namesTemplateState(targetYear, sourceState);
    } else if (mode === "recurring") {
      state = recurringTemplateState(targetYear, sourceState);
    } else if (mode === "full") {
      state = fullYearTemplateState(targetYear, sourceState);
    } else {
      state = emptyTemplateState(targetYear, sourceState);
      state.theme = "green";
    }
    pendingYearTemplateTarget = null;
    pendingYearTemplateSource = null;
    if (el.yearTemplateDialog) el.yearTemplateDialog.hidden = true;
    resetTransientUiState();
    scheduleSave();
    renderAll();
  }

  function openYearTemplateDialog(targetYear, sourceState) {
    pendingYearTemplateTarget = targetYear;
    pendingYearTemplateSource = sourceState || state;
    if (el.yearTemplateDialog) el.yearTemplateDialog.hidden = false;
    syncYearTemplateDialogText();
    if (el.yearTemplateEmpty) setTimeout(() => el.yearTemplateEmpty.focus(), 20);
  }

  function positionCellNote() {
    const dlg = document.getElementById("cell-note-dialog");
    if (!dlg || dlg.hidden) return;
    const margin = 10;
    const width = Math.min(280, Math.max(220, window.innerWidth - margin * 2));
    dlg.style.maxWidth = width + "px";
    if (!noteAnchorEl || typeof noteAnchorEl.getBoundingClientRect !== "function") {
      dlg.style.left = margin + "px";
      dlg.style.top = margin + "px";
      return;
    }
    const rect = noteAnchorEl.getBoundingClientRect();
    const dlgRect = dlg.getBoundingClientRect();
    const left = Math.max(margin, Math.min(rect.left, window.innerWidth - dlgRect.width - margin));
    const preferTop = rect.bottom + 8;
    const belowFits = preferTop + dlgRect.height <= window.innerHeight - margin;
    const top = belowFits
      ? preferTop
      : Math.max(margin, rect.top - dlgRect.height - 8);
    dlg.style.left = left + "px";
    dlg.style.top = top + "px";
  }

  function openCellNote(title, initial, apply, anchorEl) {
    noteApply = apply;
    noteAnchorEl = anchorEl || null;
    const dlg = document.getElementById("cell-note-dialog");
    const titleEl = document.getElementById("cell-note-title");
    const ta = document.getElementById("cell-note-text");
    if (titleEl) titleEl.textContent = title;
    if (ta) {
      ta.value = initial || "";
      ta.dir = "auto";
    }
    if (dlg) {
      dlg.hidden = false;
      positionCellNote();
      if (ta) setTimeout(() => ta.focus(), 20);
    }
  }

  function closeCellNote(saveChanges) {
    const dlg = document.getElementById("cell-note-dialog");
    const ta = document.getElementById("cell-note-text");
    if (saveChanges && noteApply && ta) noteApply(ta.value);
    if (dlg) {
      dlg.hidden = true;
      dlg.style.left = "";
      dlg.style.top = "";
      dlg.style.maxWidth = "";
    }
    noteApply = null;
    noteAnchorEl = null;
  }

  function hideCellContextMenu() {
    if (el.cellContextMenu) {
      el.cellContextMenu.hidden = true;
      el.cellContextMenu.style.left = "";
      el.cellContextMenu.style.top = "";
    }
    cellContextAction = null;
    cellContextActions = null;
  }

  function showCellContextMenu(ev, actions) {
    if (!el.cellContextMenu || !el.cellContextAddComment) {
      if (actions && typeof actions.comment === "function") actions.comment();
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    cellContextActions = actions || null;
    cellContextAction = actions && typeof actions.comment === "function" ? actions.comment : null;
    el.cellContextAddComment.textContent = actions && actions.commentLabel ? actions.commentLabel : t("contextAddComment");
    if (el.cellContextDeleteComment) {
      el.cellContextDeleteComment.hidden = !Boolean(actions && actions.hasComment);
    }
    el.cellContextMenu.hidden = false;
    const margin = 8;
    const menuRect = el.cellContextMenu.getBoundingClientRect();
    const maxLeft = Math.max(margin, window.innerWidth - menuRect.width - margin);
    const maxTop = Math.max(margin, window.innerHeight - menuRect.height - margin);
    const left = Math.min(ev.clientX, maxLeft);
    const top = Math.min(ev.clientY, maxTop);
    el.cellContextMenu.style.left = left + "px";
    el.cellContextMenu.style.top = top + "px";
    if (el.cellContextCut) el.cellContextCut.focus();
  }

  function wireNoteDialog() {
    const cancelBtn = document.getElementById("cell-note-cancel");
    const dlg = document.getElementById("cell-note-dialog");
    if (cancelBtn) cancelBtn.addEventListener("click", () => closeCellNote(true));
    if (el.yearActionReset) {
      el.yearActionReset.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        hideYearActionsMenu();
        resetCurrentYear();
      });
    }
    if (el.yearActionUndoReset) {
      el.yearActionUndoReset.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        hideYearActionsMenu();
        undoResetCurrentYear();
      });
    }
    if (el.yearActionEmptyNext) {
      el.yearActionEmptyNext.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        hideYearActionsMenu();
        openNextYearFromCurrent("empty");
      });
    }
    if (el.yearActionNamesNext) {
      el.yearActionNamesNext.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        hideYearActionsMenu();
        openNextYearFromCurrent("names");
      });
    }
    if (el.yearActionRecurringNext) {
      el.yearActionRecurringNext.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        hideYearActionsMenu();
        openNextYearFromCurrent("recurring");
      });
    }
    if (el.yearActionCopyNext) {
      el.yearActionCopyNext.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        hideYearActionsMenu();
        openNextYearFromCurrent("full");
      });
    }
    if (el.yearTemplateCancel) el.yearTemplateCancel.addEventListener("click", () => closeYearTemplateDialog());
    if (el.yearTemplateEmpty) el.yearTemplateEmpty.addEventListener("click", () => applyYearTemplateChoice("empty"));
    if (el.yearTemplateNames) el.yearTemplateNames.addEventListener("click", () => applyYearTemplateChoice("names"));
    if (el.yearTemplateRecurring) el.yearTemplateRecurring.addEventListener("click", () => applyYearTemplateChoice("recurring"));
    if (el.yearTemplateFull) el.yearTemplateFull.addEventListener("click", () => applyYearTemplateChoice("full"));
    const runCellContextAction = async (key, ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const actions = cellContextActions;
      hideCellContextMenu();
      const action = actions && typeof actions[key] === "function" ? actions[key] : null;
      if (action) await action();
    };
    if (el.cellContextCut) {
      el.cellContextCut.addEventListener("click", async (ev) => {
        await runCellContextAction("cut", ev);
      });
    }
    if (el.cellContextCopy) {
      el.cellContextCopy.addEventListener("click", async (ev) => {
        await runCellContextAction("copy", ev);
      });
    }
    if (el.cellContextPaste) {
      el.cellContextPaste.addEventListener("click", async (ev) => {
        await runCellContextAction("paste", ev);
      });
    }
    if (el.cellContextAddComment) {
      el.cellContextAddComment.addEventListener("click", async (ev) => {
        await runCellContextAction("comment", ev);
      });
    }
    if (el.cellContextDeleteComment) {
      el.cellContextDeleteComment.addEventListener("click", async (ev) => {
        await runCellContextAction("deleteComment", ev);
      });
    }
    document.addEventListener("click", (ev) => {
      if (el.yearActionsMenu && !el.yearActionsMenu.hidden) {
        if (!el.yearActionsMenu.contains(ev.target) && ev.target !== el.btnResetYear) hideYearActionsMenu();
      }
      if (el.yearTemplateDialog && !el.yearTemplateDialog.hidden && ev.target === el.yearTemplateDialog) {
        closeYearTemplateDialog();
      }
      if (dlg && !dlg.hidden) {
        if (!dlg.contains(ev.target)) closeCellNote(true);
      }
      if (!el.cellContextMenu || el.cellContextMenu.hidden) return;
      if (el.cellContextMenu.contains(ev.target)) return;
      hideCellContextMenu();
    });
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") hideCellContextMenu();
      if (ev.key === "Escape") hideYearActionsMenu();
      if (ev.key === "Escape" && el.yearTemplateDialog && !el.yearTemplateDialog.hidden) {
        ev.preventDefault();
        closeYearTemplateDialog();
      }
      if (ev.key === "Escape" && dlg && !dlg.hidden) {
        ev.preventDefault();
        closeCellNote(true);
      }
      if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter" && dlg && !dlg.hidden) {
        ev.preventDefault();
        closeCellNote(true);
      }
      if ((ev.ctrlKey || ev.metaKey) && !ev.shiftKey && String(ev.key).toLowerCase() === "z" && pendingRowUndo) {
        if (isTypingTarget(ev.target)) return;
        ev.preventDefault();
        undoLastRowAction();
      }
    });
    /* Capture phase + KeyN: Electron default menu / browser often eat Ctrl+N before bubble. */
    window.addEventListener(
      "keydown",
      (ev) => {
        if (!(ev.ctrlKey || ev.metaKey) || ev.shiftKey || ev.altKey) return;
        const isN = String(ev.key || "").toLowerCase() === "n" || ev.code === "KeyN";
        if (!isN) return;
        if (isTypingTarget(ev.target)) return;
        ev.preventDefault();
        ev.stopPropagation();
        addNewBillRow();
      },
      true
    );
    window.addEventListener("resize", hideCellContextMenu);
    window.addEventListener("resize", hideYearActionsMenu);
    document.addEventListener("scroll", hideCellContextMenu, true);
    document.addEventListener("scroll", hideYearActionsMenu, true);
    window.addEventListener("resize", positionCellNote);
    document.addEventListener("scroll", positionCellNote, true);
  }

  function buildMonthCellForCategory(cat, m, rowLabel, onAmountChange) {
    const rowLocked = Boolean(cat.locked);
    cat.comments = padString12(cat.comments);
    const td = document.createElement("td");
    td.className = "cell-mo";
    const wrap = document.createElement("div");
    wrap.className = "mo-cell";
    const preview = document.createElement("div");
    preview.className = "cell-note-preview";
    const syncNoteUI = (text) => {
      const trimmed = String(text || "").trim();
      wrap.classList.toggle("has-note", trimmed.length > 0);
      wrap.dataset.notePreview = trimmed;
      preview.textContent = trimmed;
      preview.hidden = trimmed.length === 0;
    };
    syncNoteUI(cat.comments[m]);
    const openNote = () => {
      const title = t("noteDialogTitle") + " — " + rowLabel + " — " + monthName(m);
      openCellNote(title, cat.comments[m], (text) => {
        cat.comments[m] = text;
        syncNoteUI(text);
        scheduleSave();
      }, wrap);
    };

    const inp = document.createElement("input");
    inp.type = "text";
    inp.inputMode = "decimal";
    inp.className = "cell-input mo-input";
    inp.value = cat.months[m];
    inp.readOnly = rowLocked;
    inp.setAttribute("aria-label", tReplace("monthAmountAria", { month: monthName(m) }));
    inp.addEventListener("input", () => {
      cat.months[m] = inp.value;
      scheduleSave();
      onAmountChange();
    });

    const hit = document.createElement("button");
    hit.type = "button";
    hit.className = "cell-note-indicator";
    hit.setAttribute("aria-label", t("cellCommentAria"));
    hit.title = t("cellCommentAria");

    wrap.appendChild(inp);
    wrap.appendChild(hit);
    wrap.appendChild(preview);
    wrap.addEventListener("contextmenu", (ev) => {
      if (rowLocked) return;
      showCellContextMenu(ev, {
        cut: async () => {
          const value = String(inp.value || "");
          const ok = await writeClipboardText(value);
          if (!ok) {
            flashSaveStatus(t("clipboardUnavailable"));
            return;
          }
          inp.value = "";
          cat.months[m] = "";
          scheduleSave();
          onAmountChange();
        },
        copy: async () => {
          const ok = await writeClipboardText(String(inp.value || ""));
          if (!ok) flashSaveStatus(t("clipboardUnavailable"));
        },
        paste: async () => {
          const text = await readClipboardText();
          if (text == null) {
            flashSaveStatus(t("clipboardUnavailable"));
            return;
          }
          inp.value = text;
          cat.months[m] = text;
          scheduleSave();
          onAmountChange();
        },
        comment: openNote,
        commentLabel: String(cat.comments[m] || "").trim() ? t("contextEditComment") : t("contextAddComment"),
        hasComment: Boolean(String(cat.comments[m] || "").trim()),
        deleteComment: async () => {
          cat.comments[m] = "";
          syncNoteUI("");
          scheduleSave();
          onAmountChange();
        },
      });
    });
    td.appendChild(wrap);
    return td;
  }

  function buildMonthCellForSalary(m, onAmountChange) {
    state.salaryComments = padString12(state.salaryComments);
    const td = document.createElement("td");
    td.className = "cell-mo cell-mo-salary";
    td.setAttribute("title", t("salaryCellHint"));
    const wrap = document.createElement("div");
    wrap.className = "mo-cell";
    const preview = document.createElement("div");
    preview.className = "cell-note-preview";
    const syncNoteUI = (text) => {
      const trimmed = String(text || "").trim();
      wrap.classList.toggle("has-note", trimmed.length > 0);
      wrap.dataset.notePreview = trimmed;
      preview.textContent = trimmed;
      preview.hidden = trimmed.length === 0;
    };
    syncNoteUI(state.salaryComments[m]);
    const openNote = () => {
      const title = t("noteDialogTitle") + " — " + t("salaryShort") + " — " + monthName(m);
      openCellNote(title, state.salaryComments[m], (text) => {
        state.salaryComments[m] = text;
        syncNoteUI(text);
        scheduleSave();
      }, wrap);
    };

    const inp = document.createElement("input");
    inp.type = "text";
    inp.inputMode = "decimal";
    inp.className = "cell-input mo-input salary-input";
    inp.value = state.salary[m];
    inp.setAttribute("aria-label", tReplace("salaryMonthAria", { month: monthName(m) }));
    inp.setAttribute("title", t("salaryCellHint"));
    inp.addEventListener("input", () => {
      state.salary[m] = inp.value;
      scheduleSave();
      onAmountChange();
    });

    const hit = document.createElement("button");
    hit.type = "button";
    hit.className = "cell-note-indicator";
    hit.setAttribute("aria-label", t("cellCommentAria"));
    hit.title = t("cellCommentAria");

    wrap.appendChild(inp);
    wrap.appendChild(hit);
    wrap.appendChild(preview);
    wrap.addEventListener("contextmenu", (ev) => {
      showCellContextMenu(ev, {
        cut: async () => {
          const value = String(inp.value || "");
          const ok = await writeClipboardText(value);
          if (!ok) {
            flashSaveStatus(t("clipboardUnavailable"));
            return;
          }
          inp.value = "";
          state.salary[m] = "";
          scheduleSave();
          onAmountChange();
        },
        copy: async () => {
          const ok = await writeClipboardText(String(inp.value || ""));
          if (!ok) flashSaveStatus(t("clipboardUnavailable"));
        },
        paste: async () => {
          const text = await readClipboardText();
          if (text == null) {
            flashSaveStatus(t("clipboardUnavailable"));
            return;
          }
          inp.value = text;
          state.salary[m] = text;
          scheduleSave();
          onAmountChange();
        },
        comment: openNote,
        commentLabel: String(state.salaryComments[m] || "").trim() ? t("contextEditComment") : t("contextAddComment"),
        hasComment: Boolean(String(state.salaryComments[m] || "").trim()),
        deleteComment: async () => {
          state.salaryComments[m] = "";
          syncNoteUI("");
          scheduleSave();
          onAmountChange();
        },
      });
    });
    td.appendChild(wrap);
    return td;
  }

  function renderCategoryRows() {
    el.gridBody.innerHTML = "";
    const query = normalizedSearch(billSearchQuery);
    syncFilterButtons();
    const visibleCategories = state.categories
      .map((cat, index) => ({ cat, index }))
      .filter(({ cat }) => {
        if (query && !normalizedSearch(cat.name).includes(query)) return false;
        return matchesRowFilter(cat);
      })
      .sort((a, b) => {
        const lockDelta = Number(Boolean(b.cat.locked)) - Number(Boolean(a.cat.locked));
        return lockDelta || a.index - b.index;
      })
      .map((entry) => entry.cat);
    if (!visibleCategories.length) {
      const tr = document.createElement("tr");
      tr.className = "row-empty-search";
      const td = document.createElement("td");
      td.colSpan = 17;
      td.className = "cell-empty-search";
      td.textContent = t("noSearchResults");
      tr.appendChild(td);
      el.gridBody.appendChild(tr);
      return;
    }
    visibleCategories.forEach((cat, rowIdx) => {
      const tr = document.createElement("tr");
      tr.className = rowIdx % 2 === 0 ? "stripe-a" : "stripe-b";
      tr.classList.toggle("row-locked", Boolean(cat.locked));
      tr.dataset.catId = cat.id;
      const syncTagUI = (tagColor, btn, cell) => {
        const color = tagColorValue(tagColor);
        const darkTag = normalizeTheme(state.theme) === "dark";
        tr.style.setProperty("--row-tag-color", color);
        tr.style.setProperty("--row-tag-soft", hexToRgba(color, darkTag ? 0.46 : 0.34));
        tr.style.setProperty("--row-tag-soft-strong", hexToRgba(color, darkTag ? 0.62 : 0.5));
        tr.dataset.tagColor = normalizeTagColor(tagColor) || "none";
        if (btn) {
          btn.style.setProperty("--tag-dot-color", color);
          const label = tagColorLabel(tagColor);
          btn.setAttribute("aria-label", t("tagColorAria") + ": " + label);
          btn.setAttribute("title", t("tagColorAria") + ": " + label);
        }
        if (cell) cell.classList.toggle("has-tag", Boolean(normalizeTagColor(tagColor)));
      };

      const tdName = document.createElement("td");
      tdName.className = "sticky-col cell-name";
      tdName.colSpan = 2;
      const nameWrap = document.createElement("div");
      nameWrap.className = "cell-name-wrap";
      const tagBtn = document.createElement("button");
      tagBtn.type = "button";
      tagBtn.className = "tag-dot-button";
      tagBtn.disabled = Boolean(cat.locked);
      tagBtn.addEventListener("click", () => {
        cat.tagColor = nextTagColor(cat.tagColor);
        syncTagUI(cat.tagColor, tagBtn, tdName);
        scheduleSave();
      });
      const inpName = document.createElement("input");
      inpName.type = "text";
      inpName.className = "cell-input name-input";
      inpName.value = cat.name;
      inpName.readOnly = Boolean(cat.locked);
      inpName.setAttribute("aria-label", t("billNameAria"));
      inpName.setAttribute("title", t("billHint"));
      inpName.addEventListener("input", () => {
        cat.name = inpName.value;
        scheduleSave();
      });
      nameWrap.appendChild(tagBtn);
      nameWrap.appendChild(inpName);
      tdName.appendChild(nameWrap);
      syncTagUI(cat.tagColor, tagBtn, tdName);

      tr.appendChild(tdName);

      const rowLabel = cat.name.trim() || t("colBill");
      const tdComment = document.createElement("td");
      tdComment.className = "cell-row-comment";
      tdComment.appendChild(
        buildRowCommentInput(cat.rowComment, (value) => {
          cat.rowComment = value;
          scheduleSave();
        }, Boolean(cat.locked), { rowLabel })
      );
      for (let m = 0; m < 12; m++) {
        tr.appendChild(
          buildMonthCellForCategory(cat, m, rowLabel, () => {
            updateRowTotal(tr, cat);
            renderFooterAndChart();
          })
        );
      }

      const tdTot = document.createElement("td");
      tdTot.className = "cell-total";
      const rt = rowTotal(cat);
      tdTot.textContent = formatMoney(rt, state.currency);
      tr.appendChild(tdTot);

      tr.appendChild(tdComment);

      const tdDel = document.createElement("td");
      tdDel.className = "cell-actions";
      const btnLock = document.createElement("button");
      btnLock.type = "button";
      btnLock.className = "btn-icon btn-icon-lock";
      btnLock.textContent = cat.locked ? "🔒" : "🔓";
      btnLock.title = cat.locked ? t("unlockRowHint") : t("lockRowHint");
      btnLock.setAttribute("aria-label", cat.locked ? t("unlockRow") : t("lockRow"));
      btnLock.addEventListener("click", () => {
        cat.locked = !cat.locked;
        scheduleSave();
        renderAll();
      });
      const btnRecurring = document.createElement("button");
      btnRecurring.type = "button";
      btnRecurring.className = "btn-icon btn-icon-recurring";
      btnRecurring.textContent = "R";
      btnRecurring.disabled = Boolean(cat.locked);
      btnRecurring.classList.toggle("is-active", Boolean(cat.recurring));
      btnRecurring.title = cat.recurring ? t("recurringRowHintOn") : t("recurringRowHintOff");
      btnRecurring.setAttribute("aria-label", cat.recurring ? t("recurringRow") : t("recurringRowOff"));
      btnRecurring.addEventListener("click", () => {
        if (cat.recurring) {
          cat.recurring = false;
          if (restoreRecurringUndo(cat)) {
            el.saveStatus.textContent = t("recurringRestored");
          }
        } else {
          const recurringChanges = fillRecurringRow(cat);
          rememberRecurringUndo(cat, recurringChanges);
          cat.recurring = true;
          if (recurringChanges.length) {
            el.saveStatus.textContent = t("recurringFilled");
          }
        }
        scheduleSave();
        renderAll();
      });
      const btnDup = document.createElement("button");
      btnDup.type = "button";
      btnDup.className = "btn-icon btn-icon-copy";
      btnDup.textContent = "+";
      btnDup.title = t("duplicateRowHint");
      btnDup.disabled = Boolean(cat.locked);
      btnDup.addEventListener("click", () => {
        const sourceIndex = state.categories.findIndex((c) => c.id === cat.id);
        if (sourceIndex < 0) return;
        const copy = cloneCategory(cat);
        copy.id = uid();
        copy.locked = false;
        const insertAt = sourceIndex + 1;
        state.categories.splice(insertAt, 0, copy);
        queueAddedRowUndo(copy, insertAt);
        scheduleSave();
        renderAll();
      });
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-icon";
      btn.textContent = "×";
      btn.title = cat.locked ? t("unlockBeforeDelete") : t("removeRow");
      btn.disabled = Boolean(cat.locked);
      btn.addEventListener("click", () => {
        const deletedIndex = state.categories.findIndex((c) => c.id === cat.id);
        if (deletedIndex < 0) return;
        queueDeletedRowUndo(cat, deletedIndex);
        state.categories = state.categories.filter((c) => c.id !== cat.id);
        if (!state.categories.length) {
          state.categories.push({ id: uid(), name: "", ref: "", months: emptyMonths(), comments: emptyMonths(), rowComment: "", tagColor: "", locked: false, recurring: false });
        }
        scheduleSave();
        renderAll();
      });
      tdDel.appendChild(btnLock);
      tdDel.appendChild(btnRecurring);
      tdDel.appendChild(btnDup);
      tdDel.appendChild(btn);
      tr.appendChild(tdDel);

      el.gridBody.appendChild(tr);
    });
  }

  function updateRowTotal(tr, cat) {
    const totalTd = tr.querySelector("td.cell-total");
    if (totalTd) totalTd.textContent = formatMoney(rowTotal(cat), state.currency);
  }

  function buildRowCommentInput(value, onInput, disabled, contextMeta) {
    const wrap = document.createElement("div");
    wrap.className = "mo-cell mo-cell-row-comment";
    const preview = document.createElement("div");
    preview.className = "cell-note-preview";
    const syncNoteUI = (text) => {
      const trimmed = String(text || "").trim();
      wrap.classList.toggle("has-note", trimmed.length > 0);
      wrap.dataset.notePreview = trimmed;
      preview.textContent = trimmed;
      preview.hidden = trimmed.length === 0;
    };
    syncNoteUI(value || "");

    const inp = document.createElement("input");
    inp.type = "text";
    inp.className = "row-comment-input";
    inp.value = value || "";
    inp.dir = "auto";
    inp.readOnly = Boolean(disabled);
    inp.addEventListener("input", () => {
      onInput(inp.value);
      syncNoteUI(inp.value);
    });

    const hit = document.createElement("button");
    hit.type = "button";
    hit.className = "cell-note-indicator";
    hit.setAttribute("aria-label", t("cellCommentAria"));
    hit.title = t("cellCommentAria");

    wrap.appendChild(inp);
    wrap.appendChild(hit);
    wrap.appendChild(preview);

    const rowLabel = contextMeta && contextMeta.rowLabel ? String(contextMeta.rowLabel) : "";
    const openRowCommentNote = rowLabel
      ? () => {
          openCellNote(
            t("noteDialogTitle") + " — " + rowLabel + " — " + t("colComment"),
            inp.value || "",
            (text) => {
              inp.value = text;
              onInput(text);
              syncNoteUI(text);
            },
            wrap
          );
        }
      : null;

    if (openRowCommentNote && !disabled) {
      wrap.addEventListener("contextmenu", (ev) => {
        showCellContextMenu(ev, {
          cut: async () => {
            const v = String(inp.value || "");
            const ok = await writeClipboardText(v);
            if (!ok) {
              flashSaveStatus(t("clipboardUnavailable"));
              return;
            }
            inp.value = "";
            onInput("");
            syncNoteUI("");
          },
          copy: async () => {
            const ok = await writeClipboardText(String(inp.value || ""));
            if (!ok) flashSaveStatus(t("clipboardUnavailable"));
          },
          paste: async () => {
            const text = await readClipboardText();
            if (text == null) {
              flashSaveStatus(t("clipboardUnavailable"));
              return;
            }
            inp.value = text;
            onInput(text);
            syncNoteUI(text);
          },
          comment: openRowCommentNote,
          commentLabel: String(inp.value || "").trim() ? t("contextEditComment") : t("contextAddComment"),
          hasComment: Boolean(String(inp.value || "").trim()),
          deleteComment: async () => {
            inp.value = "";
            onInput("");
            syncNoteUI("");
          },
        });
      });
    }

    return wrap;
  }

  function renderSalaryRow() {
    el.salaryBlock.innerHTML = "";
    el.salaryBlock.className = "row-salary sheet-salary-row";

    const tdSalLabel = document.createElement("td");
    tdSalLabel.className = "col-span-sticky cell-salary-label";
    tdSalLabel.colSpan = 2;
    const salaryLabel = document.createElement("span");
    salaryLabel.textContent = t("salaryShort");
    tdSalLabel.appendChild(salaryLabel);
    appendHintBadge(tdSalLabel, t("salaryHint"));
    el.salaryBlock.appendChild(tdSalLabel);

    const tdCom = document.createElement("td");
    tdCom.className = "cell-row-comment cell-row-comment-salary";
    tdCom.appendChild(
      buildRowCommentInput(
        state.salaryRowComment,
        (value) => {
          state.salaryRowComment = value;
          scheduleSave();
        },
        false,
        { rowLabel: t("salaryShort") }
      )
    );

    for (let m = 0; m < 12; m++) {
      el.salaryBlock.appendChild(
        buildMonthCellForSalary(m, () => {
          const totalTd = el.salaryBlock.querySelector("td.cell-total");
          if (totalTd) {
            const st = state.salary.reduce((a, _, i) => a + salaryTotalMonth(i), 0);
            totalTd.textContent = formatMoney(st, state.currency);
          }
          renderFooterAndChart();
        })
      );
    }

    const tdTot = document.createElement("td");
    tdTot.className = "cell-total";
    const st = state.salary.reduce((a, _, i) => a + salaryTotalMonth(i), 0);
    tdTot.textContent = formatMoney(st, state.currency);
    tdTot.title = t("yearSalaryTotalHint");
    el.salaryBlock.appendChild(tdTot);

    el.salaryBlock.appendChild(tdCom);

    const tdPad = document.createElement("td");
    tdPad.className = "cell-actions";
    el.salaryBlock.appendChild(tdPad);
  }

  function renderFooterAndChart() {
    const colTot = columnTotals();
    const grand = colTot.reduce((a, b) => a + b, 0);
    const salaryRow = state.salary.map((_, i) => salaryTotalMonth(i));
    renderTrendInsights(colTot, salaryRow);

    el.footerBlock.innerHTML = "";

    const trTot = document.createElement("tr");
    trTot.className = "row-footer-total";
    const tdL = document.createElement("td");
    tdL.className = "footer-label col-span-sticky";
    tdL.colSpan = 2;
    const totStrong = document.createElement("strong");
    totStrong.textContent = t("total");
    tdL.appendChild(totStrong);
    appendHintBadge(tdL, t("totalHint"));
    trTot.appendChild(tdL);
    for (let m = 0; m < 12; m++) {
      const td = document.createElement("td");
      td.className = "cell-mo footer-num";
      td.textContent = formatMoney(colTot[m], state.currency);
      td.title = tReplace("monthTotalHint", { month: monthName(m) });
      trTot.appendChild(td);
    }
    const tdG = document.createElement("td");
    tdG.className = "cell-total grand-total";
    tdG.textContent = formatMoney(grand, state.currency);
    tdG.title = t("yearTotalHint");
    trTot.appendChild(tdG);
    const tdGcom = document.createElement("td");
    tdGcom.className = "cell-row-comment cell-row-comment-footer";
    trTot.appendChild(tdGcom);
    const tdE = document.createElement("td");
    tdE.className = "cell-actions";
    trTot.appendChild(tdE);
    el.footerBlock.appendChild(trTot);

    const chartCap = 3000;
    const maxM = Math.max(chartCap, 1e-6);
    const chartReduceMotion =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.chartBlock.innerHTML = "";
    const trChart = document.createElement("tr");
    trChart.className = "row-spending-chart";
    const tdChartLabel = document.createElement("td");
    tdChartLabel.className = "footer-label col-span-sticky chart-row-label";
    tdChartLabel.colSpan = 2;
    tdChartLabel.innerHTML = "&nbsp;";
    tdChartLabel.setAttribute("aria-hidden", "true");
    trChart.appendChild(tdChartLabel);
    for (let i = 0; i < 12; i++) {
      const name = monthName(i);
      const monthVal = colTot[i];
      const tdMo = document.createElement("td");
      tdMo.className = "cell-mo chart-mo-cell";
      const wrap = document.createElement("div");
      wrap.className = "chart-col-inner";
      const plot = document.createElement("div");
      plot.className = "chart-bar-plot";
      plot.setAttribute("aria-hidden", "true");
      const track = document.createElement("div");
      track.className = "chart-bar-track";
      const bar = document.createElement("div");
      bar.className = "chart-bar";
      const ratio = monthVal > 0 ? Math.min(monthVal / maxM, 1) : 0;
      const stagger = i * 0.038;
      if (monthVal > 0) {
        if (chartReduceMotion) {
          bar.style.transform = "scaleY(" + ratio + ")";
          bar.style.transition = "none";
        } else {
          bar.setAttribute("data-chart-ratio", String(ratio));
          bar.style.transitionDelay = stagger + "s";
        }
      } else {
        bar.classList.add("chart-bar-zero");
        bar.style.transform = "scaleY(0)";
        bar.style.transition = "none";
      }
      const tip = name + ": " + formatMoney(monthVal, state.currency);
      bar.title = tip;
      track.appendChild(bar);
      plot.appendChild(track);
      wrap.appendChild(plot);
      tdMo.appendChild(wrap);
      tdMo.setAttribute("aria-label", tip);
      trChart.appendChild(tdMo);
    }
    const tdChTot = document.createElement("td");
    tdChTot.className = "cell-total chart-row-pad";
    tdChTot.innerHTML = "&nbsp;";
    trChart.appendChild(tdChTot);
    const tdChCom = document.createElement("td");
    tdChCom.className = "cell-row-comment chart-row-pad";
    tdChCom.innerHTML = "&nbsp;";
    trChart.appendChild(tdChCom);
    const tdChAct = document.createElement("td");
    tdChAct.className = "cell-actions chart-row-pad";
    tdChAct.innerHTML = "&nbsp;";
    trChart.appendChild(tdChAct);
    el.chartBlock.appendChild(trChart);

    const trRem = document.createElement("tr");
    trRem.className = "row-footer-remainder";
    const tdR = document.createElement("td");
    tdR.className = "footer-label col-span-sticky";
    tdR.colSpan = 2;
    const remLabel = document.createElement("span");
    remLabel.textContent = t("remaining");
    tdR.appendChild(remLabel);
    appendHintBadge(tdR, t("remainingHint"));
    trRem.appendChild(tdR);
    for (let m = 0; m < 12; m++) {
      const rem = salaryRow[m] - colTot[m];
      const td = document.createElement("td");
      td.className = "cell-mo footer-num " + (rem >= 0 ? "cell-pos" : "cell-neg");
      td.textContent = formatMoney(rem, state.currency);
      td.title = tReplace("remainingMonthHint", { month: monthName(m) });
      trRem.appendChild(td);
    }
    const remYear = salaryRow.reduce((a, b) => a + b, 0) - grand;
    const tdRY = document.createElement("td");
    tdRY.className = "cell-total " + (remYear >= 0 ? "cell-pos" : "cell-neg");
    tdRY.textContent = formatMoney(remYear, state.currency);
    tdRY.title = t("yearRemainingHint");
    trRem.appendChild(tdRY);
    const tdRYcom = document.createElement("td");
    tdRYcom.className = "cell-row-comment cell-row-comment-footer";
    trRem.appendChild(tdRYcom);
    const tdE2 = document.createElement("td");
    tdE2.className = "cell-actions";
    trRem.appendChild(tdE2);
    el.chartBlock.appendChild(trRem);

    if (!chartReduceMotion) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          trChart.querySelectorAll(".chart-bar[data-chart-ratio]").forEach((b) => {
            const r = parseFloat(b.getAttribute("data-chart-ratio"), 10);
            b.removeAttribute("data-chart-ratio");
            if (Number.isFinite(r) && r > 0) {
              b.style.transform = "scaleY(" + r + ")";
            }
          });
        });
      });
    }

    const tds = el.salaryBlock.querySelectorAll("td.cell-total");
    if (tds[0]) tds[0].textContent = formatMoney(salaryRow.reduce((a, b) => a + b, 0), state.currency);
  }

  function renderAll() {
    applyChromeI18n();
    syncFormFromState();
    renderSalaryRow();
    renderCategoryRows();
    renderFooterAndChart();
    renderYearOverview();
    renderTrashBin();
    renderBackupHistory();
    updateStickyRowOffsets();
  }

  function setTheme(theme) {
    state.theme = normalizeTheme(theme);
    scheduleSave();
    renderAll();
  }

  function setLocale(loc) {
    if (!SUPPORTED_LOCALES.includes(loc)) return;
    state.locale = loc;
    scheduleSave();
    renderAll();
  }

  el.year.addEventListener("change", () => {
    const y = parseInt(el.year.value, 10);
    if (!Number.isFinite(y)) {
      el.year.value = String(state.year);
      return;
    }
    if (y === state.year) {
      el.year.value = String(state.year);
      return;
    }
    clearTimeout(saveDebounceTimer);
    persist();
    const existingYearState = loadYearState(y);
    if (existingYearState) {
      switchToYear(y);
      return;
    }
    openYearTemplateDialog(y, state);
  });

  if (el.theme) {
    el.theme.addEventListener("change", () => setTheme(el.theme.value));
  }

  if (el.btnResetYear) {
    el.btnResetYear.addEventListener("click", (ev) => toggleYearActionsMenu(ev));
  }

  el.currency.addEventListener("change", () => {
    state.currency = el.currency.value;
    scheduleSave();
    renderAll();
  });

  el.notes.addEventListener("input", () => {
    state.notes = el.notes.value;
    scheduleSave();
  });

  if (el.billSearch) {
    el.billSearch.addEventListener("input", () => {
      billSearchQuery = el.billSearch.value;
      renderCategoryRows();
    });
  }

  if (el.billFilters) {
    el.billFilters.querySelectorAll(".panel-filter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        rowFilterMode = btn.getAttribute("data-filter") || "all";
        renderCategoryRows();
      });
    });
  }

  if (el.btnClearTrash) {
    el.btnClearTrash.addEventListener("click", () => {
      state.trash = [];
      scheduleSave();
      renderTrashBin();
    });
  }

  if (el.btnClearBackups) {
    el.btnClearBackups.addEventListener("click", () => {
      backups = [];
      lastBackupAt = 0;
      persistBackups();
      renderBackupHistory();
    });
  }

  if (el.btnBackupNow) {
    el.btnBackupNow.addEventListener("click", () => {
      createBackupFromSnapshot(stateSnapshot(), "manual");
      renderBackupHistory();
      flashSaveStatus(t("manualBackupDone"));
    });
  }

  if (el.btnPrint) {
    el.btnPrint.addEventListener("click", () => window.print());
  }

  if (el.btnAddCat) {
    el.btnAddCat.addEventListener("click", () => addNewBillRow());
  }

  el.btnExport.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "nas-budget-" + state.year + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  if (el.btnUndoDelete) {
    el.btnUndoDelete.addEventListener("click", () => undoLastRowAction());
  }

  el.importFile.addEventListener("change", () => {
    const f = el.importFile.files && el.importFile.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const text = String(r.result || "").replace(/^\uFEFF/, "");
      try {
        const d = JSON.parse(text);
        if (d.version === 2) {
          state = normalizeState(d);
        } else if (d.income || d.expenses) {
          state = migrateV1(d);
        } else {
          alert(t("badImport"));
          el.importFile.value = "";
          return;
        }
        scheduleSave();
        renderAll();
      } catch {
        const csv = importGoogleBudgetCsv(text);
        if (csv) {
          state = normalizeState({
            version: 2,
            locale: state.locale,
            year: csv.year,
            currency: csv.currency || state.currency,
            categories: csv.categories,
            salary: csv.salary,
            salaryComments: padString12(state.salaryComments),
            notes: state.notes,
          });
          scheduleSave();
          renderAll();
        } else {
          alert(t("badImport"));
        }
      }
      el.importFile.value = "";
    };
    r.readAsText(f);
  });

  document.querySelectorAll(".btn-lang").forEach((btn) => {
    btn.addEventListener("click", () => setLocale(btn.getAttribute("data-locale")));
  });

  wireNoteDialog();
  load();
  renderAll();
  window.addEventListener("resize", updateStickyRowOffsets);
})();
