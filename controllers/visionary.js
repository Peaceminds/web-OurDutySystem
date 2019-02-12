// index:

module.exports = {
  'GET /visonary': async (ctx, next) => {
    let user = ctx.state.myusername
    if (user) {
      ctx.render('visionary.html', {
        title: 'Visualization',
        user: user
      })
    } else {
      ctx.response.redirect('/signin')
    }
  }
}
