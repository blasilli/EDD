import RUMActivityModel from './activityModel'
import RUMConstraintModel from './constraintModel'
import { RUMModelStringParsingError as StrError } from './error'

export default class RUMModel {
  static fromString (str) {
    return parseFromString(str)
  }

  static fromVERTOModel (model) {
    return parseFromVertoModel(model)
  }

  constructor () {
    this.data = {
      activities: [],
      constraints: []
    }
  }

  activities (value) {
    if (value === undefined) return this.data.activities
    this.data.activities = value
    return this
  }

  constraints (value) {
    if (value === undefined) return this.data.constraints
    this.data.constraints = value
    return this
  }

  toString () {
    const lines = []
    this.activities().forEach(a => {
      lines.push(a.toString())
    })
    this.constraints().forEach(c => {
      lines.push(c.toString())
    })
    return lines.join('\n')
  }
}

/* ********************************************
**********        PARSER *********************
*********************************************/

function parseFromString (str) {
  if (typeof str !== 'string') throw StrError('[RUMModel] Input str in not a string', str)

  const activities = []
  const constraints = []

  const lines = str.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  lines.forEach(l => {
    if (l.startsWith('activity')) activities.push(RUMActivityModel.fromString(l))
    else constraints.push(RUMConstraintModel.fromString(l))
  })

  const model = new RUMModel()
  model.activities(activities)
  model.constraints(constraints)

  return model
}

function parseFromVertoModel (vertoModel) {

}
