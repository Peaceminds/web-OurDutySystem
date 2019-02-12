// sysMaintain:

module.exports = {
  'GET /scheduling': async (ctx, next) => {
    let user = ctx.state.myusername
    if (user) {
      ctx.render('scheduling.html', {
        title: 'Scheduling'
      })
    } else {
      ctx.response.redirect('/signin')
    }
  }
}
