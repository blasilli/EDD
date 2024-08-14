import { RUMModelStringParsingError as StrError } from './error'

export default class RUMActivityModel {
  static fromString (str) {
    return parseFromString(str)
  }

  constructor () {
    this.name = null
  }

  activityName (value) {
    if (value === undefined) return this.name
    this.name = value
    return this
  }

  toString () {
    return `activity ${this.activityName()}`
  }
}

/* ********************************************
**********        PARSER *********************
*********************************************/

function parseFromString (str) {
  if (typeof str !== 'string') throw StrError('[RUMActivityModel] Input str in not a string')

  if (!str.startsWith('activity')) throw new StrError('[RUMActivityModel] Invalid format.', str)
  const name = str.replace('activity', '').trim()

  const model = new RUMActivityModel()
  model.activityName(name)

  return model
}
