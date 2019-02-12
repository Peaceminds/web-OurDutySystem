// templateMaintain:

module.exports = {
  'GET /templateMaintain': async (ctx, next) => {
    let user = ctx.state.myusername
    if (user) {
      ctx.render('templateMaintain.html', {
        title: 'templateMaintaince'
      })
    } else {
      ctx.response.redirect('/signin')
    }
  }
}
