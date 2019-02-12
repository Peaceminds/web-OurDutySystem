// sign in:

module.exports = {
  'GET /signin': async (ctx, next) => {
    ctx.render('signin.html')
  },

  'POST /signin': async (ctx, next) => {
    let myusername = ctx.request.body.myusername
    let mypassword = ctx.request.body.mypassword
    if (!myusername || !mypassword || myusername !== 'beats') {
      // console.log(`Input username is: ${myusername} ; Input password is: ${mypassword}`)
      ctx.render('signin-failed.html', {
        errHint: 'Invalid UserName!'
      })
    } else if (mypassword !== '1') {
      ctx.render('signin-failed.html', {
        errHint: 'Wrong Password!'
      })
    } else {
      let user = {
        myusername: myusername
      }
      let cookieValue = Buffer.from(JSON.stringify(user)).toString('base64')
      console.log(`Set cookie value : ${cookieValue} for ${myusername}`)
      ctx.cookies.set('myusername', cookieValue)
      ctx.response.redirect('/')
    }
  },

  'GET /signout': async (ctx, next) => {
    ctx.cookies.set('myusername', '')
    ctx.response.redirect('/signin')
  }
}
