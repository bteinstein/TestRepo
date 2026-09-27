/**
 * Powerline Baptist Church – Personal Finances questions (October: Capacity Building)
 * Receives form POSTs and appends them to the "Questions" tab of the bound Google Sheet.
 */
const SHEET_NAME = "Questions";

/** Run once from the editor to grant permissions and create the header row. */
function setup() {
  getSheet_();
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME, 0);
    sh.appendRow(["Submitted (Lagos time)", "Topic", "Question", "Name"]);
    sh.setFrozenRows(1);
    sh.getRange("A1:D1").setFontWeight("bold").setBackground("#FDEBDD");
    sh.setColumnWidth(1, 150);
    sh.setColumnWidth(2, 220);
    sh.setColumnWidth(3, 480);
    sh.setColumnWidth(4, 160);
    sh.getRange("C:C").setWrap(true);
    const s1 = ss.getSheetByName("Sheet1");
    if (s1 && s1.getLastRow() === 0) ss.deleteSheet(s1);
  }
  return sh;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    const clean = v => String(v || "").trim().slice(0, 1500).replace(/^[=+\-@]/, "'$&"); // block formula injection
    if (!clean(p.question)) return json_({ ok: false, error: "empty" });
    getSheet_().appendRow([
      Utilities.formatDate(new Date(), "Africa/Lagos", "yyyy-MM-dd HH:mm"),
      clean(p.topic),
      clean(p.question),
      clean(p.name) || "Anonymous"
    ]);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, service: "PBC questions" });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
