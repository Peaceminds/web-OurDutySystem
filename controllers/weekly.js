// weekly:

module.exports = {
  'GET /weekly/:wkid': async (ctx, next) => {
    let user = ctx.state.myusername
    let wkid = ctx.params.wkid
    if (user) {
      ctx.render('weekly.html', {
        title: 'weSYS',
        user: user,
        wkidGet: wkid
      })
    } else {
      ctx.response.redirect('/signin')
    }
  }
}
