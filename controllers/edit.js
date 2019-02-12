// weeklyEdit:

module.exports = {
  'GET /edit': async (ctx, next) => {
    let user = ctx.state.myusername
    if (user) {
      ctx.render('edit.html', {
        title: 'Editing',
        wkid: ctx.query.wkid
      })
    } else {
      ctx.response.redirect('/signin')
    }
  }
}
