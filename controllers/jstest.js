// weeklyEdit:

module.exports = {
  'GET /jstest': async (ctx, next) => {
    ctx.render('jstest.html', {
      title: 'Welcome'
    })
  }
}
