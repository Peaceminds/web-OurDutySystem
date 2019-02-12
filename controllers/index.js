// index:

module.exports = {
  'GET /': async (ctx, next) => {
    let user = ctx.state.myusername
    if (user) {
      console.log(`Identification confirmed, welcome back, ${user}!`)
      ctx.render('index.html', {
        title: 'OurWeeklys',
        user: user
      })
    } else {
      ctx.response.redirect('/signin')
    }
  }
}
