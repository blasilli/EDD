import { ModelStringParsingError as StrError } from './error'

export default class ActivityModel {
  static fromString (str) {
    return parseFromString(str)
  }

  constructor () {
    this.id = null
    this.name = null
    this.geometry = {
      x: null,
      y: null,
      width: null,
      height: null
    }
  }

  activityId (value) {
    if (value === undefined) return this.id
    this.id = value
    return this
  }

  activityName (value) {
    if (value === undefined) return this.name
    this.name = value
    return this
  }

  x (value) {
    if (value === undefined) return this.geometry.x
    this.geometry.x = value
    return this
  }

  y (value) {
    if (value === undefined) return this.geometry.y
    this.geometry.y = value
    return this
  }

  width (value) {
    if (value === undefined) return this.geometry.width
    this.geometry.width = value
    return this
  }

  height (value) {
    if (value === undefined) return this.geometry.height
    this.geometry.height = value
    return this
  }

  toString () {
    return `activity ${this.activityName()}`
  }
}

/* ********************************************
**********        PARSER *********************
*********************************************/

function getAttr (obj, key) {
  if (key in obj) return obj[key]
  else throw new StrError(`[ActivityModel] Input obj has not key '${key}'`, obj)
}

function parseFromString (str) {
  if (typeof str !== 'string') throw StrError('Input str in not a string')
  try {
    const obj = JSON.parse(str)
    const model = new ActivityModel()

    model.activityId(getAttr(obj, 'id'))
    model.activityName(getAttr(obj, 'name'))
    model.x(getAttr(getAttr(obj, 'geometry'), 'x'))
    model.y(getAttr(getAttr(obj, 'geometry'), 'y'))
    model.width(getAttr(getAttr(obj, 'geometry'), 'width'))
    model.height(getAttr(getAttr(obj, 'geometry'), 'height'))

    return model
  } catch (exc) {
    console.error(exc)
    throw new StrError('[ActivityModel] Cannot parser Input str as a json. Invalid format.')
  }
}
