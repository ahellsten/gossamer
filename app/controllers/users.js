import Ember from 'ember'
// import Cryptojs from '/node_modules/crypto-js'

export default Ember.Controller.extend({
  userid: '',
  firstname: '',
  kind: '',
  customerid: '',
  couuid: '',

  conetworks: Ember.computed('customerid', function () {
    let netobjlist = []
    let netlist = []
    if (this.get('customerid') !== '') {
      let co = this.get('store').peekRecord('customer', parseInt(this.get('customerid')))
      netlist = co.get('conets')

      if (netlist.length === 1) {
        let network = this.get('store').peekRecord('network', netlist[0])
        netobjlist.push({
          id: network.get('id'),
          coid: network.get('customerid'),
          name: network.get('name'),
          net: network.get('net')
        })
        return Ember.RSVP.hash({
          networks: netobjlist
        })
      }
      if (netlist.length > 1) {
        netlist.map((e) => {
          let network = this.get('store').peekRecord('network', e)
          netobjlist.push({
            id: network.get('id'),
            coid: network.get('customerid'),
            name: network.get('name'),
            net: network.get('net')
          })
        })
        return Ember.RSVP.hash({
          networks: netobjlist
        })
      }
      if (netlist.length === 0) {
        return Ember.RSVP.hash({
          networks: netobjlist
        })
      }
    }
  }),

  coname: Ember.computed('customerid', function () {

  }),

  companyname: '',
  netids: [],

  usernetlist: Ember.computed('userid', function () {
    let usernetwors = []
    if (this.get('userid') !== '') {
      usernetwors = this.get('store').peekRecord('user', this.get('userid')).get('usrnets')
    }
    Ember.Logger.info(usernetwors)
    return `${usernetwors}`
  }),

  name: '',
  username: '',
  isDisabled: 'disabled',
  changePass: 'disabled',
  datavalue: 'data-value',
  responseMessage: '',

  init () {
    this._super(...arguments)
    this.errors = []
    this.act = 'Save'
    this.buttonico = 'save'
  },

  actions: {
    required (event) {
      if (!event.target.value) {
        this.get('errors').pushObject({message: `${event.target.name} is required`})
      }
    },

    resetForm () {
      this.setProperties({
        userid: '',
        firstname: '',
        kind: '',
        customerid: '',
        couuid: '',
        companyname: '',
        netids: [],
        name: '',
        username: '',
        isDisabled: 'disabled',
        changePass: 'disabled'
      })
      Ember.$('.card').removeClass('blue')
      Ember.$('.togDisabled').addClass('disabled')
      // // remove edit screen
      // if (Ember.$('.editcard').length > 0) {
      //   Ember.$('.editcard').remove()
      // }
    },

    toggleActive (set, toSet) {
      if (set !== toSet) {
        Ember.$('.card').removeClass('blue')
        Ember.$('.usr-' + toSet).addClass('blue')
        Ember.$('.togDisabled').removeClass('disabled')
        // // enter edit screen
        // if (Ember.$('.editcard').length === 0) {
        //   Ember.$('.pusher')
        //     .parent()
        //     .prepend('<div class="editcard"></div>')
        //   Ember.$('.editcard')
        //    .append(`<button class="ui animated fade button grey" type="reset">
        //   <div class="visible content" >Cancel</div>
        //   <div class="hidden content"><i class="cancel icon"></i></div>
        // </button>`)
        //   Ember.$('.editcard').addClass('show')
        // }
      }
    },

    setCoNetworks () {
      Ember.Logger.info(this.get('conetworks'))
    },

    openModal (name) {
      Ember.$('.ui.' + name + '.modal').modal('show')
    },

    showUser (uid, username) {
      let user = this.get('store').peekRecord('user', uid)
      let customer = this.get('store').peekRecord('customer', parseInt(user.get('customerid')))
      this.send('toggleActive', this.get('username'), username)
      this.setProperties({
        userid: parseInt(user.get('id')),
        kind: user.get('kind'),
        customerid: parseInt(customer.get('id')),
        couuid: customer.get('couuid'),
        companyname: customer.get('companyname'),
        name: user.get('name'),
        firstname: user.get('firstname'),
        username: username
      })
      this.set('netids', user.get('usrnets'))
    },

    saveUser () {
      if (this.get('act') === 'Save') {
        this.send('updateUser')
      }
    },

    deactivateUser (uid) {
      this.get('store').findRecord('user', parseInt(uid))
      .then(function (user) {
        user.set('valid', 'inactive')
        if (user.get('hasDirtyAttributes')) {
          Ember.Logger.info(user.changedAttributes())
          user.save()
          .then((response) => {
            this.set('responseMessage', `User ${response.get('store').peekRecord('user', response.get('id')).get('firstname')} was deactivated`)
            Ember.Logger.info(this.get('responseMessage'))
          })
          .catch((adapterError) => {
            Ember.Logger.info(user.get('errors'))
            Ember.Logger.info(user.get('errors.name'))
            Ember.Logger.info(user.get('errors').toArray())
            Ember.Logger.info(user.get('isValid'))
            Ember.Logger.info(adapterError)
          })
        }
      }.bind(this))
      this.send('resetForm')
    },

    activateUser (uid) {
      this.get('store').findRecord('user', parseInt(uid))
      .then(function (user) {
        user.set('valid', 'active')
        if (user.get('hasDirtyAttributes')) {
          Ember.Logger.info(user.changedAttributes())
          user.save()
          .then((response) => {
            this.set('responseMessage', `User ${response.get('store').peekRecord('user', response.get('id')).get('firstname')} was activated`)
            Ember.Logger.info(this.get('responseMessage'))
          })
          .catch((adapterError) => {
            Ember.Logger.info(user.get('errors'))
            Ember.Logger.info(user.get('errors.name'))
            Ember.Logger.info(user.get('errors').toArray())
            Ember.Logger.info(user.get('isValid'))
            Ember.Logger.info(adapterError)
          })
        }
      }.bind(this))
    },

    updateUser () {
      let uid = this.get('userid')
      let kind = this.get('kind')
      let cuid = this.get('customerid')
      let couuid = this.get('store').peekRecord('customer', parseInt(cuid)).get('couuid')
      let nets = this.get('netids').sort(function (a, b) { return parseInt(a) - parseInt(b) })

      this.get('store').findRecord('user', parseInt(uid))
      .then(function (user) {
        user.set('customerid', parseInt(cuid))
        user.set('couuid', couuid)
        user.set('kind', kind)
        user.set('usrnets', nets)
        if (user.get('hasDirtyAttributes')) {
          Ember.Logger.info(user.changedAttributes())
          user.save()
          .then((response) => {
            this.set('responseMessage', `User ${response.get('store').peekRecord('user', response.get('id')).get('firstname')} was updated`)
          })
          .catch((adapterError) => {
            Ember.Logger.info(user.get('errors'))
            Ember.Logger.info(user.get('errors.name'))
            Ember.Logger.info(user.get('errors').toArray())
            Ember.Logger.info(user.get('isValid'))
            Ember.Logger.info(adapterError)
          })
        }
      }.bind(this))
    }

  }

})
