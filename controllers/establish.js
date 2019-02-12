// weeklyEstablish:

module.exports = {
  'GET /establish': async (ctx, next) => {
    let user = ctx.state.myusername
    if (user) {
      ctx.render('establish.html', {
        title: 'Establishing'
      })
    } else {
      ctx.response.redirect('/signin')
    }
  }
}
