const db = require('../db')

module.exports = db.defineModel('templates', {
  wkGeneral: db.TEXT,
  wkIntelSysSummary: db.TEXT,
  wkLinkSysSummary: db.TEXT,
  wkSecSummary: db.TEXT,
  wkDutyCheckSummary: db.TEXT,
  wkHeavyDutySummary: db.TEXT
})
