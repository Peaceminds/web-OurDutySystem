const events = require('./events')
const APIError = require('../rest').APIError

module.exports = {

  /* ------------ For index ------------ */

  // 01 - 查全部周报
  'GET /api/wklists': async (ctx, next) => {
    console.log(`API - Getting all the weeklys...`)
    // * WARNING -- 若是调用的export方法里采用了数据库等异步操作，此处一定要加await修饰！
    // * WARNING -- 否则会因耗时太久导致数据传不过来！
    var w = await events.getWeeklys()
    if (w) {
      console.log(`API = All weeklys had been getted.`)
      ctx.rest({ wkLists: w })
    } else {
      throw new APIError('weeklys: access error', 'access weeklys api failed!')
    }
  },

  // 02 - 删除指定周报
  'DELETE /api/wklist/:wkid': async (ctx, next) => {
    console.log(`API - Delete weekly: ${ctx.params.wkid}...`)
    var w = await events.deleteWeekly(ctx.params.wkid)
    if (w) {
      console.log(`API = Weekly: ${ctx.params.wkid} has been deleted.`)
      ctx.rest(w)
    } else {
      throw new APIError('weekly: not_found', 'can not found weekly by id, delete failed!')
    }
  },

  /* ------------ For weekly, edit ------------ */

  // 01 - 读取指定周报详情
  'GET /api/weekly/:wkid': async (ctx, next) => {
    console.log(`API - Getting weekly: ${ctx.params.wkid}...`)
    var wkid = getCaption(ctx.params.wkid)
    var w = await events.getWeeklyDetails(wkid)
    if (w) {
      console.log(`API = Weekly: ${ctx.params.wkid} has been getted.`)
      ctx.rest({ wkDetails: w })
    } else {
      throw new APIError('weekly: not_found', 'can not found weekly by id, getting failed!')
    }
  },

  // 02 - 读取指定周报的关联cases
  'GET /api/cases/:wkid': async (ctx, next) => {
    console.log(`API - Getting case by wkid: ${ctx.params.wkid}...`)
    var wkid = getCaption(ctx.params.wkid)
    var c = await events.getCases(wkid)
    if (c) {
      console.log(`API = Cases related to weekly: ${ctx.params.wkid} has been getted.`)
      ctx.rest({ wkCases: c })
    } else {
      throw new APIError('cases: not_found', 'can not found cases by weekly id, getting failed!')
    }
  },

  /* ------------ For edit ------------ */

  // 更新周报 根据页面form内容
  'POST /api/weekly/update': async (ctx, next) => {
    console.log(`API - Updating weekly by id: ...`)
    var uwRes = await events.updateWeekly(
      ctx.request.body.wkid,
      ctx.request.body.year,
      ctx.request.body.week,
      ctx.request.body.wkGeneral,
      ctx.request.body.wkIntelSysSummary,
      ctx.request.body.wkLinkSysSummary,
      ctx.request.body.wkSecSummary,
      ctx.request.body.wkDutyCheckSummary,
      ctx.request.body.wkHeavyDutySummary
    )
    if (uwRes.status) {
      console.log(`API = weekly (except the cases) has been updated, continue to update related cases.`)
      var dcRes = {}
      var ncRes = {}
      var ucRes = {}
      if (ctx.request.body.intelCasesDeleted.length !== 0) {
        dcRes = await events.deleteCases(ctx.request.body.intelCasesDeleted)
        if (dcRes.status) {
          console.log(`API = target cases have been deleted, continue to update the other cases.`)
        } else {
          throw new APIError('weekly: update_cases_error', 'can not delete cases in weekly, updating failed!')
        }
      } else {
        dcRes.status = true
      }
      if (ctx.request.body.intelCasesNew.length !== 0) {
        ncRes = await events.createCases(ctx.request.body.wkid, ctx.request.body.intelCasesNew)
        if (ncRes.status) {
          console.log(`API = target cases have been created, continue to update the other cases.`)
        } else {
          throw new APIError('weekly: update_cases_error', 'can not create cases in weekly, updating failed!')
        }
      } else {
        ncRes.status = true
      }
      if (ctx.request.body.intelCasesUpdated.length !== 0) {
        ucRes = await events.updateCases(ctx.request.body.intelCasesUpdated)
        if (ucRes.status) {
          console.log(`API = target cases have been updated, continue to update the other cases.`)
        } else {
          throw new APIError('weekly: update_cases_error', 'can not update cases in weekly, updating failed!')
        }
      } else {
        ucRes.status = true
      }
      if (dcRes.status && ncRes.status && ucRes.status) {
        ctx.rest({ updWeeklyFinalRes: true })
      }
      // console.log(JSON.stringify(ucRes))
    } else {
      ctx.rest({ updWeeklyFinalRes: false })
      throw new APIError('weekly: update_weekly_error', 'can not update weekly by id, updating failed!')
    }
  },

  /* ------------ For establish ------------ */

  // 新建周报 根据页面form内容
  'POST /api/weekly/establish': async (ctx, next) => {
    console.log(`API - Establishing new weekly...`)
    // console.log(JSON.stringify(ctx))
    var ewRes = await events.createWeekly( // 此处不加 await 会导致接收不到 ewRes 回传
      ctx.request.body.year,
      ctx.request.body.week,
      ctx.request.body.wkGeneral,
      ctx.request.body.wkIntelSysSummary,
      ctx.request.body.wkLinkSysSummary,
      ctx.request.body.wkSecSummary,
      ctx.request.body.wkDutyCheckSummary,
      ctx.request.body.wkHeavyDutySummary
    )
    if (ewRes.status) {
      console.log(`API = New weekly (except the cases) has been established, continue to establish related cases.`)
      var wid = ewRes.wid
      var ecList = ctx.request.body.intelCasesList
      if (ecList === undefined || ecList.length === 0) {
        console.log(`API = New full weekly has been established (No cases added), continue to establish related cases.`)
        ctx.rest({ estWeeklyFinalRes: 'good' })
      } else {
        for (var i in ecList) {
          ecList[i].weeklyId = wid
        }
        var ecRes = await events.createCases(wid, ecList)
        if (ecRes.status) {
          console.log(`API = New full weekly has been established, continue to establish related cases.`)
          ctx.rest({ estWeeklyFinalRes: ecRes.status })
        } else {
          throw new APIError('weekly: est_cases_error', 'can not establish cases in weekly, establishing failed!')
        }
      }
    } else {
      throw new APIError('weekly: est_weekly_error', 'can not establish any weekly, establishing failed!')
    }
  },

  /* ------------ For divisions ------------ */

  // 01 - 读取全部divisions数据
  'GET /api/divisions': async (ctx, next) => {
    console.log(`API - Getting all divisions...`)
    var d = await events.getDivisions()
    if (d) {
      console.log(`API = All divisions had been getted.`)
      ctx.rest({ divList: d })
    } else {
      throw new APIError('divisions: not_found', 'access divisions api failed!')
    }
  },

  // 02 - 增加division记录
  'POST /api/division/create': async (ctx, next) => {
    console.log(`API - Creating new division...`)
    var d = await events.createDivision(
      ctx.request.body.warZone,
      ctx.request.body.branchSysName,
      ctx.request.body.sysRemark
    )
    if (d) {
      console.log(`API = New division has been created.`)
      ctx.rest({ divList: d })
    } else {
      throw new APIError('divisions: create_error', 'can not create new division!')
    }
  },

  // 03 - 修改division记录
  'POST /api/division/update': async (ctx, next) => {
    console.log(`API - Updating the division: ${ctx.params.id}...`)
    var upData = {}
    var upIndex = {}
    upData.warZone = ctx.request.body.warZone
    upData.branchSysName = ctx.request.body.branchSysName
    upData.sysRemark = ctx.request.body.sysRemark
    upIndex.id = ctx.request.body.id
    var d = events.updateDivision(upData, upIndex)
    if (d) {
      console.log(`API = Division: ${ctx.params.id} has been updated.`)
      ctx.rest(d)
    } else {
      throw new APIError('divisions: update_error', 'can not update the division!')
    }
    ctx.rest(d)
  },

  // 04 - 删除指定did的division记录
  'DELETE /api/division/:id': async (ctx, next) => {
    console.log(`API - Deleting the division: ${ctx.params.id}...`)
    var d = events.deleteDivision(getCaption(ctx.params.id))
    if (d) {
      console.log(`API = Division: ${ctx.params.id} has been deleted.`)
      ctx.rest(d)
    } else {
      throw new APIError('division: delete_error', 'can not delete the division!')
    }
  },


  /* ------------ For visionary ------------ */

  // 01 - chart 01 04 05 06
  'GET /api/davi/weeklysdataset': async (ctx, next) => {
    console.log(`API - Getting dataset part01 for visualization...`)
    var year  = ctx.query.year
    var wds = await events.getWeeklysDataset(year)
    if (wds) {
      console.log(`API = weeklysDataset has been getted.`)
      // console.log('weeklysdataset返回给visionary的数据: ' + JSON.stringify(wds))
      ctx.rest({ wds: wds })
    } else {
      throw new APIError('weeklysDataset: access error', 'access weeklysDataset api failed!')
    }
  },

  // 02 - chart 02 03
  'GET /api/davi/casesdataset': async (ctx, next) => {
    console.log(`API - Getting dataset part02 for visualization...`)
    var year  = ctx.query.year
    var cds = await events.getCasesDataset(year)
    if (cds) {
      console.log(`API = casesDataset has been getted.`)
      console.log('casesdataset返回给visionary的数据: ' + JSON.stringify(cds))
      ctx.rest({ cds: cds })
    } else {
      throw new APIError('casesDataset: access error', 'access casesDataset api failed!')
    }
  },


  /* ------------ For template ------------ */

  'GET /api/templates': async (ctx, next) => {
    console.log(`API - Getting templates data...`)
    var tl = await events.getTemplateData()
    if (tl) {
      console.log(`API = Templates data has been getted.`)
      ctx.rest({ templatesList: tl })
    } else {
      throw new APIError('template: access error', 'access template api failed!')
    }
  },

  'POST /api/templatemaintain': async (ctx, next) => {
    console.log(`API - Updating template...`)
    console.log(ctx)
    var tname  = ctx.request.body.tn
    var ttext  = ctx.request.body.tt
    var udt = await events.updateTemplate(tname, ttext)
    if (udt) {
      console.log(`API = Templates has been updated.`)
      ctx.rest({ udt: udt })
    } else {
      throw new APIError('template: updating error', 'access template updating api failed!')
    }
  }

}

/* ------------ Pubic functions ------------ */

function getCaption (obj) {
  var index = obj.lastIndexOf(':')
  obj = obj.substring(index + 1, obj.length)
  return obj
}
