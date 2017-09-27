import Ember from 'ember'

export default Ember.Route.extend({
  resultPromise: {},
  model () {
    return Ember.RSVP.hash({
      rules: this.get('store').findAll('rule', {page: 1})
    })
  },

  setupController (controller, model) {
    this._super(...arguments)

    Ember.set(controller, 'rules', model.rules)
  }
})
