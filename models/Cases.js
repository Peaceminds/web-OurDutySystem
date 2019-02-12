const db = require('../db')

module.exports = db.defineModel('cases', {
  weeklyId: db.ID,
  year: db.INTEGER,
  week: db.INTEGER,
  warZone: db.TEXT,
  branchSysName: db.TEXT,
  period11: {
    type: db.BIGINT,
    allowNull: true
  },
  period12: {
    type: db.BIGINT,
    allowNull: true
  },
  period21: {
    type: db.BIGINT,
    allowNull: true
  },
  period22: {
    type: db.BIGINT,
    allowNull: true
  },
  period31: {
    type: db.BIGINT,
    allowNull: true
  },
  period32: {
    type: db.BIGINT,
    allowNull: true
  },
  caseDescription: db.TEXT,
  otherText: {
    type: db.TEXT,
    allowNull: true
  }
})
