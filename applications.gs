function doGet(e){
  return handleResponse(e);
}

var config = {
    SHEET_ID: 'MY_SHEET_ID',
    SHEET_NAME: 'Sheet1',
    EMAIL_ADDRESS: 'example@clan.com',
}
var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

function handleResponse(e) {
  // public lock that locks for all invocations
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.
  try {
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(config.SHEET_NAME);
    // we'll assume header is in row 1 but you can override with header_row in GET/POST data
    var headRow = e.parameter.header_row || 1;
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1; // get next row
    var row = [];
    var applicationData = {
        gamertag: e.parameter["Gamertag"],
        discord: e.parameter["Discord"],
        pvpKd: e.parameter["PvP KD"],
        pvpKda: e.parameter["PvP KDA"],
        pvpKad: e.parameter["PvP KAD"],
        pvpKills: e.parameter["PvP Kills"],
        raidClears: e.parameter["Raid Clears"],
        referredBy: e.parameter["ReferredBy"],
        applied: e.parameter["Applied"]
    };
    // get row data
    for (i in headers){
      row.push(e.parameter[headers[i]]);
    }
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    // send email
    sendEmail(applicationData);
    // return json success results
    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
          .setMimeType(ContentService.MimeType.JSON);
  } catch(e){
    // if error return this
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally { //release lock
    lock.releaseLock();
  }
}

function sendEmail(data) {
    MailApp.sendEmail({
      to: config.EMAIL_ADDRESS,
      subject: "New Clan Application: " + data.gamertag + " [" + new Date().toLocaleString() + "]",
      htmlBody: '<p><b>Gamertag:</b> ' + data.gamertag + '</p>' +
      '<p><b>Discord:</b> ' + data.discord + '</p>' +
      '<p><b>PvP KD:</b> ' + data.pvpKd + '</p>' +
      '<p><b>PvP KDA:</b> ' + data.pvpKda + '</p>' +
      '<p><b>PvP Efficiency:</b> ' + data.pvpKad + '</p>' +
      '<p><b>PvP Kills:</b> ' + data.pvpKills + '</p>' +
      '<p><b>Raid Clears:</b> ' + data.raidClears + '</p>' +
      '<p><b>Referred by:</b> ' + data.referredBy + '</p>' +
      '<p><b>Applied at:</b> ' + data.applied + '</p>' +
      '<a href="{{YOUR_SHEET_URL}}">Check it out</a>'
    });
}

function setUp() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
}