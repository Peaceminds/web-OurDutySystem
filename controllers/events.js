// All of the backend logics.

const model = require('../model')

let Weeklys = model.Weekly
let Cases = model.Cases
let Divisions = model.Divisions
let Templates = model.Templates
Weeklys.hasMany(Cases, { foreignKey: 'weeklyId', sourceKey: 'id', as: 'Cases' })
Cases.belongsTo(Weeklys, { foreignKey: 'weeklyId', targetKey: 'id', as: 'Weeklys' })

// weeklys constructor for query.
function WKLConstructor(id, year, week, weekStr, updatedAt, updatedAtStr) {
  this.id = id
  this.year = year
  this.week = week
  this.weekStr = weekStr
  this.updatedAt = updatedAt
  this.updatedAtStr = updatedAtStr
}
// weekly single constructor for create.
function WeeklyConstructor(year, week, wkGeneral, wkIntelSysSummary, wkLinkSysSummary, wkSecSummary, wkDutyCheckSummary, wkHeavyDutySummary) {
  this.year = year
  this.week = week
  this.wkGeneral = wkGeneral
  this.wkIntelSysSummary = wkIntelSysSummary
  this.wkLinkSysSummary = wkLinkSysSummary
  this.wkSecSummary = wkSecSummary
  this.wkDutyCheckSummary = wkDutyCheckSummary
  this.wkHeavyDutySummary = wkHeavyDutySummary
}
// weekly single constructor for create.
function WeeklyUpdateConstructor(id, year, week, wkGeneral, wkIntelSysSummary, wkLinkSysSummary, wkSecSummary, wkDutyCheckSummary, wkHeavyDutySummary) {
  this.id = id
  this.year = year
  this.week = week
  this.wkGeneral = wkGeneral
  this.wkIntelSysSummary = wkIntelSysSummary
  this.wkLinkSysSummary = wkLinkSysSummary
  this.wkSecSummary = wkSecSummary
  this.wkDutyCheckSummary = wkDutyCheckSummary
  this.wkHeavyDutySummary = wkHeavyDutySummary
}
// divisions constructor for query.
function DivisionsConstructor(warZone, branchSysName, sysRemark, id) {
  this.warZone = warZone
  this.branchSysName = branchSysName
  this.sysRemark = sysRemark
  this.id = id
}
// cases constructor for query.
function CasesConstructor(id, weeklyId, year, week, date, warZone, branchSysName, period11, period12, period21, period22, period31, period32, caseDescription, otherText) {
  this.id = id
  this.weeklyId = weeklyId
  this.year = year
  this.week = week
  this.date = date
  this.warZone = warZone
  this.branchSysName = branchSysName
  this.period11 = period11
  this.period12 = period12
  this.period21 = period21
  this.period22 = period22
  this.period31 = period31
  this.period32 = period32
  this.caseDescription = caseDescription
  this.otherText = otherText
}
// cases constructor for update.
function CaseUpdateConstructor(intelCasesListItem) {
  this.year = intelCasesListItem.year
  this.week = intelCasesListItem.week
  this.warZone = intelCasesListItem.warZone
  this.branchSysName = intelCasesListItem.branchSysName
  this.period11 = intelCasesListItem.period11
  this.period12 = intelCasesListItem.period12
  this.period21 = intelCasesListItem.period21
  this.period22 = intelCasesListItem.period22
  this.period31 = intelCasesListItem.period31
  this.period32 = intelCasesListItem.period32
  this.caseDescription = intelCasesListItem.caseDescription
}

module.exports = {

  /* ------------ Weekly Series ------------ */

  // index - weekly querying.
  // * WARNING: Remember add "async、await" modifier. Otherwise, the Promise will report error！And the db commit will be skip.
  getWeeklys: async () => {
    var weeklys = []
    var queryWks = await Weeklys.findAll({
      attributes: ['id', 'year', 'week', 'updatedAt']
    })
    if (queryWks) {
      console.log(`End = Weeklys Get Confirm!`)
    } else {
      console.log(`End x Weeklys Get Failed!`)
      return null
    }
    queryWks = orderDesByWeek(queryWks)
    for (var p in queryWks) {
      weeklys.push(
        new WKLConstructor(
          queryWks[p].id,
          queryWks[p].year,
          queryWks[p].week,
          '第' + queryWks[p].week + '周周报',
          getTime(queryWks[p].updatedAt),
          getTimeStr(queryWks[p].updatedAt)
        )
      )
    }
    return weeklys
  },

  // weekly edit - target weekly querying (by wkid).
  getWeeklyDetails: async wkid => {
    var queryWkById = await Weeklys.findAll({
      where: {
        id: wkid
      }
    })
    if (queryWkById) {
      console.log(`End = Weekly Get Confirm!`)
      return queryWkById
    } else {
      console.log(`End x Weekly Get Failed!`)
      return null
    }
  },

  // establish - weekly creating.
  createWeekly: async (year, week, wkGeneral, wkIntelSysSummary, wkLinkSysSummary, wkSecSummary, wkDutyCheckSummary, wkHeavyDutySummary) => {
    var res = {}
    var weeklyIns = new WeeklyConstructor(year, week, wkGeneral, wkIntelSysSummary, wkLinkSysSummary, wkSecSummary, wkDutyCheckSummary, wkHeavyDutySummary)
    var wi = await Weeklys.create(weeklyIns)
    if (wi) {
      // console.log('End = Weekly Establish Confirm! 已创建weekly的id为: ' + JSON.stringify(wi))
      console.log('End = Weekly Establish Confirm!')
      res.status = true
      res.wid = wi.id
    } else {
      console.log(`End x Weekly Establish Failed!`)
      res.status = false
      res.wid = null
    }
    return res
  },

  // index - weekly deleting.
  deleteWeekly: async id => {
    var w = await Weeklys.destroy({
      where: {
        id: id
      }
    })
    if (w) {
      console.log(`End = Weekly Delete Confirm!`)
      return w
    } else {
      console.log(`End x Weekly Delete Failed!`)
      return null
    }
  },

  // edit - weekly updating.
  updateWeekly: async (id, year, week, wkGeneral, wkIntelSysSummary, wkLinkSysSummary, wkSecSummary, wkDutyCheckSummary, wkHeavyDutySummary) => {
    var weeklyUpdateIns = new WeeklyUpdateConstructor(id, year, week, wkGeneral, wkIntelSysSummary, wkLinkSysSummary, wkSecSummary, wkDutyCheckSummary, wkHeavyDutySummary)
    var uw = await Weeklys.update(weeklyUpdateIns, {
      where: {
        id: id
      }
    })
      .then(ok => {
        console.log(`End = Weekly Update Confirm!`)
      })
      .catch(e => {
        console.log(`End x Weekly Update Failed!`)
        return { 'status': false }
      })
    // console.log(uw)
    return { 'status': true }
  },

  /* ------------ Cases Series ------------ */

  // weekly edit - cases querying by weekly id.
  getCases: async wkid => {
    var cases = []
    var queryCss = await Cases.findAll({
      where: {
        weeklyId: wkid
      }
    })
    if (queryCss) {
      console.log(`End = Cases Get Confirm!`)
    } else {
      console.log(`End x Cases Get Failed!`)
      return null
    }
    queryCss = orderAscByDate(queryCss)
    for (var p in queryCss) {
      cases.push(
        new CasesConstructor(
          queryCss[p].id,
          queryCss[p].weeklyId,
          queryCss[p].year,
          queryCss[p].week,
          getDateStr(queryCss[p].period11),
          queryCss[p].warZone,
          queryCss[p].branchSysName,
          getTimeStr(queryCss[p].period11),
          getTimeStr(queryCss[p].period12),
          getTimeStr(queryCss[p].period21),
          getTimeStr(queryCss[p].period22),
          getTimeStr(queryCss[p].period31),
          getTimeStr(queryCss[p].period32),
          queryCss[p].caseDescription,
          queryCss[p].otherText
        )
      )
    }
    return cases
  },

  // establish edit - cases establishing.
  createCases: async (weeklyId, ecList) => {
    // console.log('weeklyId: ' + JSON.stringify(weeklyId))
    // console.log('ecList: ' + JSON.stringify(ecList))
    // * * *  Question - 这里还应该怎么写？ * * *
    // var caseIns = []
    // for (var ec in ecList) {
    //   console.log('ecList[ec]: ' + JSON.stringify(ecList[ec]))
    //   var tc = new CaseConstructor(ecList[ec].weeklyId, ecList[ec].year, ecList[ec].warZone, ecList[ec].branchSysName, ecList[ec].period11, ecList[ec].period12, ecList[ec].period21, ecList[ec].period22, ecList[ec].period31, ecList[ec].period32, ecList[ec].caseDescription)
    //   caseIns.push(tc)
    // }
    // var c = await Cases.bulkCreate(caseIns)
    // console.log(JSON.stringify(caseIns))
    var res = {}
    var c = null
    for (var ec in ecList) {
      c = await Cases.create({
        weeklyId: weeklyId,
        year: ecList[ec].year,
        week: ecList[ec].week,
        warZone: ecList[ec].warZone,
        branchSysName: ecList[ec].branchSysName,
        period11: ecList[ec].period11,
        period12: ecList[ec].period12,
        period21: ecList[ec].period21,
        period22: ecList[ec].period22,
        period31: ecList[ec].period31,
        period32: ecList[ec].period32,
        caseDescription: ecList[ec].caseDescription
      })
    }
    // console.log(c)
    if (c) {
      // console.log('End = Cases Establish Confirm! 已插入的最后一条Cases数据: ' + JSON.stringify(c))
      console.log('End = Cases Establish Confirm!')
      res.status = true
    } else {
      console.log(`End x Cases Establish Failed!`)
      res.status = false
    }
    return res
  },

  // edit - target cases deleting. (It's seems like that it is not necessary. Because of the cascade relationship with the Weekly table?)
  deleteCases: async deletedCases => {
    var dc = null
    for (var i = 0; i < deletedCases.length; i++) {
      dc = await Cases.destroy({
        where: {
          id: deletedCases[i]
        }
      })
    }
    if (dc) {
      console.log(`End = Case Delete Confirm!`)
      return { 'status': true }
    } else {
      console.log(`End x Cases Delete Failed!`)
      return { 'status': false }
    }
  },

  // edit - cases updating by target wkid.
  updateCases: async updatedCases => {
    var uc = null
    for (var i = 0; i < updatedCases.length; i++) {
      console.log("*)*)*)*)*)*)" + updatedCases[i])
      var caseUpdateIns = new CaseUpdateConstructor(updatedCases[i])
      uc = await Cases.update(caseUpdateIns, {
        where: {
          id: updatedCases[i].id
        }
      })
        .then(ok => {
          console.log(`End = Case Update Confirm!`)
        })
        .catch(e => {
          console.log(`End x Case Update Failed!`)
          return { 'status': false }
        })
    }
    // console.log(uc)
    return { 'status': true }
  },

  /* ------------ Divisions Series ------------ */

  // edit establish divisions - get all divisions.
  getDivisions: async () => {
    var divisions = []
    var queryDivs = await Divisions.findAll({
      attributes: ['warZone', 'branchSysName', 'sysRemark', 'id']
    })
    if (queryDivs) {
      console.log(`End = Divisions Get Confirm!`)
    } else {
      console.log(`End x Divisions Get Failed!`)
      return null
    }
    queryDivs = orderResultAsc(queryDivs)
    for (var p in queryDivs) {
      divisions.push(
        new DivisionsConstructor(
          queryDivs[p].warZone,
          queryDivs[p].branchSysName,
          queryDivs[p].sysRemark,
          queryDivs[p].id
        )
      )
    }
    return divisions
  },

  // divisions - division establishing.
  createDivision: async (warZone, branchSysName, sysRemark) => {
    var wz = warZone
    var bs = branchSysName
    var sr = sysRemark
    var d = await Divisions.create({
      warZone: wz,
      branchSysName: bs,
      sysRemark: sr
    })
    if (d) {
      console.log(`End = Divison Get Confirm!`)
      return d
    } else {
      console.log(`End x Divison Get Failed!`)
      return null
    }
  },

  // divisions - division deleting.
  deleteDivision: async id => {
    var d = await Divisions.destroy({
      where: {
        id: id
      }
    })
    if (d) {
      console.log(`End = Divison Delete Confirm!`)
      return d
    } else {
      console.log(`End x Divison Delete Failed!`)
      return null
    }
  },

  // divisions - division updating.
  updateDivision: async (upData, upIndex) => {
    var d = await Divisions.update(upData, { where: upIndex })
    if (d) {
      console.log(`End = Divison Update Confirm!`)
      return d
    } else {
      console.log(`End x Divison Update Failed!`)
      return null
    }
  },

  /* ------------ Visionary Series ------------ */

  getWeeklysDataset: async (year) => {
    var queryWkDS = await Weeklys.findAll({
      where: { year: year }
    })
    var weekList = [];
    var usageRateList = [];
    var flightList = [];
    var secureScoresList = [];
    var virusCasesList = [];
    var videoDutyList = [];
    var ipDutyList = [];
    var voiceDutyList = [];
    var satelliteDutyList = [];
    var textDutyList = [];
    if (queryWkDS) {
      console.log(`End = WeeklysDataset Getting Confirm!`)
      // 过滤从数据库中读取的数据 提供给charts01 04 05 06
      for (var i = 0; i < queryWkDS.length; i++) {
        weekList.push(queryWkDS[i].week);
      };
      weekList.sort(function (x, y) {
        return x - y;
      });
      for (var i = 0; i < weekList.length; i++) {
        for (var j = 0; j < queryWkDS.length; j++) {
          if (queryWkDS[j].week == weekList[i]) {
            var usageRate = getUsageRate(queryWkDS[j].wkLinkSysSummary);
            var flight = getFlight(queryWkDS[j].wkLinkSysSummary);
            var secureScores = getSecureScores(queryWkDS[j].wkSecSummary);
            var virusCases = getVirusCases(queryWkDS[j].wkSecSummary);
            var splitedDutyList = []
            splitedDutyList = splitDutySummary(queryWkDS[j].wkDutyCheckSummary)
            var videoDuty = getVideoDuty(splitedDutyList[0]);
            var ipDuty = getIpDuty(splitedDutyList[1]);
            var voiceDuty = getVoiceDuty(splitedDutyList[2]);
            var satelliteDuty = getSatelliteDuty(splitedDutyList[3]);
            var textDuty = getTextDutyList(splitedDutyList[4]);
            usageRateList.push(usageRate);
            flightList.push(flight);
            secureScoresList.push(secureScores);
            virusCasesList.push(virusCases);
            videoDutyList.push(videoDuty);
            ipDutyList.push(ipDuty);
            voiceDutyList.push(voiceDuty);
            satelliteDutyList.push(satelliteDuty);
            textDutyList.push(textDuty);
          }
        }
      }
      return {
        'weekList': weekList,
        'usageRateList': usageRateList,
        'flightList': flightList,
        'secureScoresList': secureScoresList,
        'virusCasesList': virusCasesList,
        'videoDutyList': videoDutyList,
        'ipDutyList': ipDutyList,
        'voiceDutyList': voiceDutyList,
        'satelliteDutyList': satelliteDutyList,
        'textDutyList': textDutyList
      }
    } else {
      console.log(`End x WeeklysDataset Getting Failed!`)
      return null
    }
  },

  getCasesDataset: async (year) => {
    var weekList = [];
    var casesDescriptionDataset = {}
    var csDataset = { 'EAST': [], 'SOUTH': [], 'WEST': [], 'NORTH': [], 'MIDDLE': [] }
    var csPieDataset = { 'pieTOTAL': {}, 'pieEAST': {}, 'pieSOUTH': {}, 'pieWEST': {}, 'pieNORTH': {}, 'pieMIDDLE': {} }
    var queryCSDS = await Cases.findAll({
      where: { year: year }
    })
    if (queryCSDS) {
      console.log(`End = CasesDataset Getting Confirm!`)
      // weekList 的获取去重和重排序
      for (var i = 0; i < queryCSDS.length; i++) {
        weekList.push(queryCSDS[i].week);
      };
      weekList = unique(weekList)
      weekList.sort(function (x, y) {
        return x - y;
      });
      casesDescriptionDataset.weekList = weekList
      // charts02 数据过滤
      for (var i = 0; i < weekList.length; i++) {
        var eastCounter = 0
        var southCounter = 0
        var westCounter = 0
        var northCounter = 0
        var middleCounter = 0
        for (var j = 0; j < queryCSDS.length; j++) {
          if (queryCSDS[j].week == weekList[i]) {
            if ((queryCSDS[j].warZone).search("东") !== -1) {
              eastCounter++
            }
            if ((queryCSDS[j].warZone).search("南") !== -1) {
              southCounter++
            }
            if ((queryCSDS[j].warZone).search("西") !== -1) {
              westCounter++
            }
            if ((queryCSDS[j].warZone).search("北") !== -1) {
              northCounter++
            }
            if ((queryCSDS[j].warZone).search("中") !== -1) {
              middleCounter++
            }
          }
        }
        csDataset.EAST[i] = eastCounter
        csDataset.SOUTH[i] = southCounter
        csDataset.WEST[i] = westCounter
        csDataset.NORTH[i] = northCounter
        csDataset.MIDDLE[i] = middleCounter
      }
      casesDescriptionDataset.csDataset = csDataset
      // charts03 数据过滤
      csPieDataset.pieTOTAL = { "fiber": 0, "electric": 0, "netGear": 0, "otherFaults": 0 }
      csPieDataset.pieEAST = { "fiber": 0, "electric": 0, "netGear": 0, "otherFaults": 0 }
      csPieDataset.pieSOUTH = { "fiber": 0, "electric": 0, "netGear": 0, "otherFaults": 0 }
      csPieDataset.pieWEST = { "fiber": 0, "electric": 0, "netGear": 0, "otherFaults": 0 }
      csPieDataset.pieNORTH = { "fiber": 0, "electric": 0, "netGear": 0, "otherFaults": 0 }
      csPieDataset.pieMIDDLE = { "fiber": 0, "electric": 0, "netGear": 0, "otherFaults": 0 }
      for (var i = 0; i < queryCSDS.length; i++) {
        if ((queryCSDS[i].warZone).search("东") !== -1) {
          csPieDataset.pieEAST = extractPieByWZ(queryCSDS[i].caseDescription, csPieDataset.pieEAST)
          // console.log("csPieDataset.pieEAST = " + JSON.stringify(csPieDataset.pieEAST))
        }
        if ((queryCSDS[i].warZone).search("南") !== -1) {
          csPieDataset.pieSOUTH = extractPieByWZ(queryCSDS[i].caseDescription, csPieDataset.pieSOUTH)
          // console.log("csPieDataset.pieSOUTH = " + JSON.stringify(csPieDataset.pieSOUTH))
        }
        if ((queryCSDS[i].warZone).search("西") !== -1) {
          csPieDataset.pieWEST = extractPieByWZ(queryCSDS[i].caseDescription, csPieDataset.pieWEST)
          // console.log("csPieDataset.pieWEST = " + JSON.stringify(csPieDataset.pieWEST))
        }
        if ((queryCSDS[i].warZone).search("北") !== -1) {
          csPieDataset.pieNORTH = extractPieByWZ(queryCSDS[i].caseDescription, csPieDataset.pieNORTH)
          // console.log("csPieDataset.pieNORTH = " + JSON.stringify(csPieDataset.pieNORTH))
        }
        if ((queryCSDS[i].warZone).search("中") !== -1) {
          csPieDataset.pieMIDDLE = extractPieByWZ(queryCSDS[i].caseDescription, csPieDataset.pieMIDDLE)
          // console.log("csPieDataset.pieMIDDLE = " + JSON.stringify(csPieDataset.pieMIDDLE))
        }
      }
      csPieDataset.pieTOTAL = combinePieValue(csPieDataset.pieTOTAL, csPieDataset.pieEAST, csPieDataset.pieSOUTH, csPieDataset.pieWEST, csPieDataset.pieNORTH, csPieDataset.pieMIDDLE)
      casesDescriptionDataset.csPieDataset = csPieDataset
      // 最终dataset返回给api.js
      return casesDescriptionDataset
    } else {
      console.log(`End x CasesDataset Getting Failed by querying Cases!`)
      return null
    }
  },

  /* ------------ Template Series ------------ */

  getTemplateData: async () => {
    var queryTD = await Templates.findAll({
      attributes: ['wkGeneral', 'wkIntelSysSummary', 'wkLinkSysSummary', 'wkSecSummary', 'wkDutyCheckSummary', 'wkHeavyDutySummary']
    })
    if (queryTD) {
      console.log(`End = Template Querying Confirm!`)
      return queryTD
    } else {
      console.log(`End x Template Querying Failed!`)
      return null
    }
  },

  updateTemplate: async (templateName, templateText) => {
    var obj = {}
    obj[templateName] = templateText
    var queryUT = await Templates.update(obj, { where: { id: 1010 } }) // id=1010 是手动插入的数据, 为了便于索引直接这样用了(对应sql语句中的测试数据)
    if (queryUT) {
      console.log(`End = Template Update Confirm!`)
      return queryUT
    } else {
      console.log(`End x Template Update Failed!`)
      return null
    }
  }

}

/* ------ Public Functions ------ */

// * Order by week, date.
function orderResultAsc(arr) {
  arr.sort(function (a, b) {
    if (a.warZone === b.warZone) {
      return b.branchSysName - a.branchSysName
    } else {
      return b.warZone - a.warZone
    }
  })
  return arr
}

function orderDesByWeek(arr) {
  var max = {}
  for (var i = 0; i < arr.length; i++) {
    for (var j = i; j < arr.length; j++) {
      if (arr[i].week < arr[j].week) {
        max = arr[j]
        arr[j] = arr[i]
        arr[i] = max
      }
    }
  }
  return arr
}

function orderAscByDate(arr) {
  var min = {}
  for (var i = 0; i < arr.length; i++) {
    for (var j = i; j < arr.length; j++) {
      if (arr[i].date > arr[j].date) {
        min = arr[j]
        arr[j] = arr[i]
        arr[i] = min
      }
    }
  }
  return arr
}

// * Sentences analysis.
// 按回车分割Duty部分语句，若语句不全则默认全部填0
function splitDutySummary(str) {
  var dutyList = []
  var strSplitList = str.split("\n");
  // console.log("strSplitList0 === " + strSplitList[0])
  // console.log("strSplitList1 === " + strSplitList[1])
  if (strSplitList.length < 5) {
    strSplitList = [0, 0, 0, 0, 0]
  }
  return strSplitList
}

// chart01 04 数据过滤 提取可直接获取的数值
function extractValue(str, index) {
  if (index !== undefined && index !== null && index !== -1) {
    str = str.replace(/\s*/g, "")
    str = str.substring(index + 1, str.length)
    var val = judgeIfNum(str)
    return val
  } else {
    return 0
  }
}

// chart05 06 数据过滤 提取Duty检查部分的数值 返回百分比数值
function extractRate(str, index1, index2) {
  // if (index1 !== undefined && index1 !== null && index1 !== -1 && index2 !== undefined && index2 !== null && index2 !== -1) {
  if (index1 !== -1 && index2 !== -1) {
    var str1 = str.substring(index1 + 1, str.length)
    var str2 = str.substring(index2 + 1, str.length)
    var testTimes = judgeIfNum(str1)
    var succedTimes = judgeIfNum(str2)
    if (testTimes !== 0) {
      return (Math.round(succedTimes / testTimes * 10000) / 100.00)
    }
    else return 0
  } else {
    return 0
  }
}

function judgeIfNum(str){
  var r = str.match(/\d+/g)
  if(r) {
    return r[0]
  } else {
    return 0
  }
}

// chart03 数据过滤 提取饼图中各事件数量
function extractPieByWZ(str, pieX) {
  // console.log("待处理str：" + str)
  if (str.indexOf("光") !== -1 || str.indexOf("光缆") !== -1 || str.indexOf("光纤") !== -1 || str.indexOf("线路") !== -1) {
    pieX.fiber++
  }
  if (str.indexOf("电") !== -1 || str.indexOf("电源") !== -1) {
    pieX.electric++
  }
  if (str.indexOf("路由") !== -1 || str.indexOf("交换机") !== -1 || str.indexOf("板卡") !== -1) {
    pieX.netGear++
  }
  if (str.indexOf("服务器") !== -1 || str.indexOf("故障") !== -1) {
    pieX.otherFaults++
  }
  // console.log("处理后str：" + JSON.stringify(pieX))
  return pieX
}

// chart03 数据过滤 各方向饼图数据汇总
function combinePieValue(ttObj, esObj, stObj, wsObj, ntObj, mdObj) {
  ttObj.fiber = esObj.fiber + stObj.fiber + wsObj.fiber + ntObj.fiber + mdObj.fiber
  ttObj.electric = esObj.electric + stObj.electric + wsObj.electric + ntObj.electric + mdObj.electric
  ttObj.netGear = esObj.netGear + stObj.netGear + wsObj.netGear + ntObj.netGear + mdObj.netGear
  ttObj.otherFaults = esObj.otherFaults + stObj.otherFaults + wsObj.otherFaults + ntObj.otherFaults + mdObj.otherFaults
  return ttObj
}

// chart01 02 04 05 06 数据过滤 辅助 getter
function getUsageRate(str) {
  var index = str.lastIndexOf("使用率")
  var val = extractValue(str, index)
  return val
}

function getFlight(str) {
  var index = str.lastIndexOf("航班数")
  var val = extractValue(str, index)
  return val
}

function getSecureScores(str) {
  var index = str.lastIndexOf("分数")
  var val = extractValue(str, index)
  return val
}

function getVirusCases(str) {
  var index = str.lastIndexOf("病毒事件")
  var val = extractValue(str, index)
  return val
}

function getVideoDuty(str) {
  if (str == 0) {
    return 0
  } else {
    var index1 = str.indexOf("视检测")
    var index2 = str.indexOf("成功")
    var val = extractRate(str, index1, index2)
    return val
  }
}

function getIpDuty(str) {
  if (str == 0) {
    return 0
  } else {
    var index1 = str.indexOf("I检测")
    var index2 = str.indexOf("成功")
    var val = extractRate(str, index1, index2)
    return val
  }
}

function getVoiceDuty(str) {
  if (str == 0) {
    return 0
  } else {
    var index1 = str.lastIndexOf("声检测")
    var index2 = str.lastIndexOf("成功")
    var val = extractRate(str, index1, index2)
    return val
  }
}

function getSatelliteDuty(str) {
  if (str == 0) {
    return 0
  } else {
    var index1 = str.lastIndexOf("星检测")
    var index2 = str.lastIndexOf("成功")
    var val = extractRate(str, index1, index2)
    return val
  }
}

function getTextDutyList(str) {
  if (str == 0) {
    return 0
  } else {
    var index1 = str.lastIndexOf("文检测")
    var index2 = str.lastIndexOf("成功")
    var val = extractRate(str, index1, index2)
    return val
  }
}

// * String deduplication
function unique(array) {
  var n = {}, r = [], len = array.length, val, type;
  for (var i = 0; i < array.length; i++) {
    val = array[i];
    type = typeof val;
    if (!n[val]) {
      n[val] = [type];
      r.push(val);
    } else if (n[val].indexOf(type) < 0) {
      n[val].push(type);
      r.push(val);
    }
  }
  return r;
}

// * Time/Date format
function getTime(timeStamp) {
  var time = new Date(timeStamp)
  var fullTime = time.getTime()
  return fullTime
}

function getTimeStr(timeStamp) {
  if (timeStamp) {
    var time = new Date(timeStamp)
    var Month = time.getMonth() + 1
    var Day = time.getDate()
    var Hour = time.getHours()
    var Minute = time.getMinutes()
    var yy = time.getFullYear() + '-'
    var mm = Month < 10 ? '0' + Month + '-' : Month + '-'
    var dd = Day < 10 ? '0' + Day : Day + ' '
    var hh = Hour < 10 ? '0' + Hour + ':' : Hour + ':'
    var mi = Minute < 10 ? '0' + Minute : Minute
    return yy + mm + dd + ' ' + hh + mi
  } else {
    return null
  }
}

function getDateStr(timeStamp) {
  if (timeStamp) {
    var date = new Date(timeStamp)
    var Month = date.getMonth() + 1
    var Day = date.getDate()
    var mm = Month < 10 ? '0' + Month + '-' : Month + '-'
    var dd = Day + 1 < 10 ? '0' + Day : Day + ' '
    return mm + dd
  } else {
    return null
  }
}

function getPeriodStr(timeStamp) {
  if (timeStamp) {
    var period = new Date(timeStamp)
    var Hour = period.getHours()
    var Minute = period.getMinutes()
    var hh = Hour < 10 ? '0' + Hour + ':' : Hour + ':'
    var mi = Minute < 10 ? '0' + Minute : Minute
    return hh + mi
  } else {
    return null
  }
}

/**
 * 判断年份是否为润年
 *
 * @param {Number} year
 */
function isLeapYear(year) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)
}

/**
* 获取某一年份的某一月份的天数
*
* @param {Number} year
* @param {Number} month
*/
function getMonthDays(year, month) {
  return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28)
}

/**
* 获取某年的某天是第几周
* @param {Number} y
* @param {Number} m
* @param {Number} d
* @returns {Number}
*/
function getWeekNumber(timeStamp) {
  if (timeStamp) {
    var now = new Date(timeStamp)
    var year = now.getFullYear()
    var month = now.getMonth()
    var days = now.getDate()
    // 那一天是那一年中的第多少天
    for (var i = 0; i < month; i++) {
      days += getMonthDays(year, i)
    }
    // 那一年第一天是星期几
    var yearFirstDay = new Date(year, 0, 1).getDay() || 7
    var week = null
    if (yearFirstDay === 1) {
      week = Math.ceil(days / yearFirstDay)
    } else {
      days -= (7 - yearFirstDay + 1)
      week = Math.ceil(days / 7) + 1
    }
    return week
  } else {
    return null
  }
}
