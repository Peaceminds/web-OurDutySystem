const model = require('./model')

let Weekly = model.Weekly
let Cases = model.Cases
let DivisionsIns = model.Divisions

Weekly.hasMany(Cases)
Cases.belongsTo(Weekly)

/*
(一)这种写法在app.js调用时 dbInitializer(); 即可
*/
async function dbInitializer () {
  var weekly = Weekly.create({
    year: 2017,
    week: 28,
    wkGeneral: 'Test text 1...',
    wkIntelSysSummary: 'Test text 2...',
    wkLinkSysSummary: 'Test text 3...',
    wkSecSummary: 'Test text 4...',
    wkDutyCheckSummary: 'Test text 5...',
    wkHeavyDutySummary: 'Test text 5...'
  })
  console.log('created: ' + JSON.stringify(weekly))

  // var cases = Cases.create({
  //   weeklyId: 'ad19bb8e-46d3-400f-b0d3-224fb1041c92',
  //   week: 43,
  //   year: 2018,
  //   warZone: '测试区域1',
  //   branchSysName: '测试单位及系统系统1',
  //   period11: 1547520100,
  //   period12: 1547521200,
  //   period21: 1547540300,
  //   period22: 1547541400,
  //   caseDescription: '测试内容，123，如果看到说明正常_(:з」∠)_',
  //   otherText: 'Nothing~'
  // })
  // console.log('created: ' + JSON.stringify(cases))

  // var divisions = await divisionsIns.create({
  //   warZone: '测试区域2',
  //   branchSysName: '测试单位及系统系统2',
  //   sysRemark: 'It\'s really remarkable! '
  // })
  // console.log('created: ' + JSON.stringify(divisions))

  // *** Read test ***
  // var queryweeklys = await Weekly.findAll({
  //   attributes: ["year", "week", "createdAt", "updatedAt"]
  // })

  // 注意！这里不需强制sync，因为现在的数据是手动写的，model里的cases没有声明外键，直接调Sequelize来sync会报错！
  // model.sync()
}

module.exports = dbInitializer
