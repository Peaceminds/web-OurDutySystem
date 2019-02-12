const db = require('../db')

module.exports = db.defineModel('weekly', {
  year: db.INTEGER,
  week: db.INTEGER,
  wkGeneral: db.TEXT,
  wkIntelSysSummary: db.TEXT,
  wkLinkSysSummary: db.TEXT,
  wkSecSummary: db.TEXT,
  wkDutyCheckSummary: db.TEXT,
  wkHeavyDutySummary: {
    type: db.TEXT,
    allowNull: true
  }
})
