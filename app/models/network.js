import DS from 'ember-data'
import { validator, buildValidations } from 'ember-cp-validations'

const Validations = buildValidations({
  customerid: validator('presence', true),
  name: validator('presence', true),
  kind: validator('presence', true),
  net: validator('presence', true)
})

export default DS.Model.extend(Validations, {
  customerid: DS.attr('number'),
  name: DS.attr('string'),
  kind: DS.attr('string'),
  net: DS.attr(),
  description: DS.attr('string'),
  customer: DS.belongsTo('customer', {readonly: true, async: true})
})
