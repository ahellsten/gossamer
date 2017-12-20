import Ember from 'ember'
// import fetch from 'fetch'

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  // loginFailed: false,
  // isProcessing: false,
  // url: 'http://10.33.1.97:4242/api/auth/',
  errorMessage: null,
  // username: null,
  // password: null,

  actions: {

    authenticate () {
      let { username, password } = this.getProperties('username', 'password')
      // Ember.Logger.info(username, password)
      this.get('session')
      .authenticate('authenticator:jwt', {username, password})
      .catch((err) => {
        this.set('errorMessage', err.error || err)
      })
    }

    // login () {
    //   this.setProperties({
    //     loginFailed: false,
    //     isProcessing: true
    //   })

    //   fetch(this.url, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       username: this.get('username'),
    //       password: this.get('password')
    //     })
    //   })
    //   .then((response) => {
    //     if (response.status !== 200) {
    //       Ember.Logger.info('Looks like there was a problem. Status Code: ' + response.status)
    //       return
    //     }
    //     return response.json()
    //       .then(function (d) {
    //         if (d.data.attributes.hasAccess) {
    //           this.set('isProcessing', false)
    //           document.location = '/dashboard'
    //         } else {
    //           this.set('loginFailed', true)
    //         }
    //       }.bind(this), function () {
    //         this.set('isProcessing', false)
    //         this.set('loginFailed', true)
    //       }.bind(this))
    //   })
    //   .catch((err) => {
    //     Ember.Logger.info('Login fetch error: ' + err)
    //   })
    // }
  }
})
