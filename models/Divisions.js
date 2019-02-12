const db = require('../db')

module.exports = db.defineModel('divisions', {
  warZone: db.TEXT,
  branchSysName: db.TEXT,
  sysRemark: {
    type: db.TEXT,
    allowNull: true
  }
})
