import { RUMModelStringParsingError as StrError } from './error'

export default class RUMOConstraintModel {
  static fromString (str) {
    return parseFromString(str)
  }

  constructor () {
    this.name = null
    this.data = {
      sourceActivityName: null,
      targetActivityName: null
    }
  }

  constraintName (value) {
    if (value === undefined) return this.name
    this.name = value
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

  toString () {
    return `${this.constraintName()}[${this.sourceActivityName()}, ${this.targetActivityName()}] | | |`
  }
}

/* ********************************************
**********        PARSER *********************
*********************************************/

function parseFromString (str) {
  if (typeof str !== 'string') throw StrError('[RUMConstraintModel] Input str in not a string', str)

  const name = str.split('[')[0].trim()
  const source = str.match(/\[([^\]]+)\]/gm)[0].split(',')[0].trim()
  let target = str.match(/\[([^\]]+)\]/gm)[0].split(',')[1].trim()
  if (target === '' || target === 'null' || target === 'undefined') target = null

  const model = new RUMOConstraintModel()
  model.constraintName(name)
  model.sourceActivityName(source)
  model.targetActivityName(target)

  return model
}
