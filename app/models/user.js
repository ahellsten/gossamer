import Ember from 'ember'
import DS from 'ember-data'
import { validator, buildValidations } from 'ember-cp-validations'

const Validations = buildValidations({
  kind: validator('presence', true),

  password: [
    validator('presence', true),
    validator('length', {
      min: 6
    })
  ]
})

export default DS.Model.extend(Validations, {
  useruuid: DS.attr('string'),
  couuid: DS.attr('string'),
  customerid: DS.attr('number'),
  companyname: DS.attr('string', {readonly: true}),
  kind: DS.attr('string'),
  name: DS.attr('string', {readonly: true}),
  phone: DS.attr('string', {readonly: true}),
  username: DS.attr('string', {readonly: true}),
  email: DS.attr('string', {readonly: true}),
  lastlogin: DS.attr('date', {readonly: true}),
  lastpasswordchange: DS.attr('date', {readonly: true}),
  networks: DS.hasMany('network', {async: true}),

  firstname: Ember.computed('name', function () {
    return `${this.get('name').split(' ')[0]}`
  })
})
