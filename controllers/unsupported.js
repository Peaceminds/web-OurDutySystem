// index:

module.exports = {
  'GET /unsupported': async (ctx, next) => {
    ctx.render('unsupported.html', {
      title: 'unsupported'
    })
  }
}
