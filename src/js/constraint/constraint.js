import constraintTypes, { getConstraintType } from '../constraintTypes'
import '../../styles/constraint.scss'
import ConstraintLine from './line'
import { ConstraintModel } from '../model'

export default class Constraint {
  constructor (id, sourceId, targetId, name, props = {}) {
    this.id = id
    this.type = name === undefined ? new constraintTypes.Relation.Response() : getConstraintType(name)
    this.name = this.type.name
    this.sourceId = sourceId
    this.targetId = targetId
    this.props = props
    this.selected = false
    this.viz = null

    this._createViz()
  }

  getSourceActivity () {
    if (this.sourceId === null) return null
    return window.app.data.getActivity(this.sourceId)
  }

  getTargetActivity () {
    if (this.targetId === null) return null
    return window.app.data.getActivity(this.targetId)
  }

  getProperty (key, defaultValue) {
    if (key in this.props) return this.props[key]
    this.props[key] = defaultValue
    return defaultValue
  }

  setProperty (key, value) {
    this.props[key] = value
    this.getSourceActivity().constraintPropertiesUpdated(this.id, key, value)
  }

  getPosition () {
    return (this.viz === null) ? { x: 0, y: 0 } : this.viz.svg.iconPositioner(this.getSourceActivity().getAnchors().center, this.getTargetActivity().getAnchors().center)
  }

  updatePosition (approximatePositioning = false) {
    if (this.viz !== null) this.viz.updatePosition(approximatePositioning)
    return this
  }

  setSelected (bool) {
    this.selected = bool
    if (this.viz !== null) this.viz.setSelected(bool)
    return this
  }

  highlight (bool = true) {
    if (this.viz !== null) this.viz.highlight(bool)
    return this
  }

  partiallyHide (bool = true) {
    if (this.viz !== null) this.viz.partiallyHide(bool)
    return this
  }

  delete () {
    if (this.viz !== null) this.viz.delete()
    return this
  }

  setType (type) {
    this.type = type
    this.name = this.type.name
    this.viz.setType(type)
    window.app.data.saveModelToCache()
  }

  _createViz () {
    if (this.targetId == null) {
      this.viz = null
    } else {
      this.viz = new ConstraintLine(this.id, this.sourceId, this.targetId, this.type)
    }
  }

  updateLineStyle (n) {
    this.viz.updateLineStyle(n)
  }

  toConstraintModel () {
    const model = new ConstraintModel()

    model.constraintId(this.id)
    model.constraintName(this.name)
    model.sourceActivityId(this.sourceId)
    model.targetActivityId(this.targetId)
    model.sourceActivityName(this.getSourceActivity().name)
    model.targetActivityName(this.getTargetActivity() === null ? null : this.getTargetActivity().name)
    model.props(this.props)
    model.x(this.getPosition().x)
    model.y(this.getPosition().y)

    return model
  }
}
