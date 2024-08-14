import { ModelStringParsingError as StrError } from './error'

export default class ConstraintModel {
  static fromString (str) {
    return parseFromString(str)
  }

  constructor () {
    this.id = null
    this.name = null

    this.data = {
      sourceActivityId: null,
      targetActivityId: null,
      sourceActivityName: null,
      targetActivityName: null,
      props: null
    }
    this.geometry = {
      x: null,
      y: null
    }
  }

  constraintId (value) {
    if (value === undefined) return this.id
    this.id = value
    return this
  }

  constraintName (value) {
    if (value === undefined) return this.name
    this.name = value
    return this
  }

  sourceActivityId (value) {
    if (value === undefined) return this.data.sourceActivityId
    this.data.sourceActivityId = value
    return this
  }

  targetActivityId (value) {
    if (value === undefined) return this.data.targetActivityId
    this.data.targetActivityId = value
    return this
  }

  sourceActivityName (value) {
    if (value === undefined) return this.data.sourceActivityName
    this.data.sourceActivityName = value
    return this
  }

  targetActivityName (value) {
    if (value === undefined) return this.data.targetActivityName
    this.data.targetActivityName = value
    return this
  }

  props (value) {
    if (value === undefined) return this.data.props
    this.data.props = value
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
}

/* ********************************************
**********        PARSER *********************
*********************************************/

function getAttr (obj, key) {
  if (key in obj) return obj[key]
  else throw new StrError(`[ConstraintModel] Input obj has not key '${key}'`, obj)
}

function parseFromString (str) {
  if (typeof str !== 'string') throw StrError('[ConstraintModel] Input str in not a string')
  try {
    const obj = JSON.parse(str)
    const model = new ConstraintModel()

    model.constraintId(getAttr(obj, 'id'))
    model.constraintName(getAttr(obj, 'name'))
    model.sourceActivityId(getAttr(getAttr(obj, 'data'), 'sourceActivityId'))
    model.targetActivityId(getAttr(getAttr(obj, 'data'), 'targetActivityId'))
    model.sourceActivityName(getAttr(getAttr(obj, 'data'), 'sourceActivityName'))
    model.targetActivityName(getAttr(getAttr(obj, 'data'), 'targetActivityName'))
    model.props(getAttr(getAttr(obj, 'data'), 'props'))
    model.x(getAttr(getAttr(obj, 'geometry'), 'x'))
    model.y(getAttr(getAttr(obj, 'geometry'), 'y'))

    return model
  } catch (exc) {
    console.error(exc)
    throw new StrError('[ConstraintModel] Cannot parser Input str as a json. Invalid format.')
  }
}
