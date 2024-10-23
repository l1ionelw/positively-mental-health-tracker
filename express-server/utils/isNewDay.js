const luxon = require("luxon");
function isNewDay(timezone, jsDate) {
  if (!jsDate) { return true; }
  const compareDay = luxon.DateTime.fromJSDate(jsDate, { zone: timezone }).setZone(timezone).startOf("days");
  const today = luxon.DateTime.now().setZone(timezone).startOf("day");
  if (today.diff(compareDay, ["days", "minutes"]).days >= 1) {
    return true;
  }
  return false;

}

module.exports = { isNewDay };