// sysMaintain:

module.exports = {
  'GET /divisions': async (ctx, next) => {
    let user = ctx.state.myusername
    if (user) {
      ctx.render('divisions.html', {
        title: 'Divisions'
      })
    } else {
      ctx.response.redirect('/signin')
    }
  }
}
