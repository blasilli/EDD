import { v4 as uuidv4 } from 'uuid'
import * as d3 from 'd3'
import Activity from './activity'
import Constraint from './constraint'
// import { JSONModel, XMLModel } from './model'
import { Model } from './model'
import packageJson from '../../package.json'

export default class Data {
  constructor (_app) {
    this.app = _app
    this.modelId = uuidv4()
    this.modelName = 'model'
    this.activities = {}
    this.constraints = {}
    this.selectedElement = null
    this.cacheKey = `EDD-v${packageJson.version}`

    d3.select(document).on('keyup.app_data', (event) => {
      const e = event
      if (e.code === 'Delete' || e.code === 'MetaRight' || e.code === 'MetaLeft') {
        // delete current selected element
        if (this.selectedElement == null) return
        const element = this.getElement(this.selectedElement)
        if (element instanceof Activity) this.deleteActivity(element.id)
        else if (element instanceof Constraint) this.deleteConstraint(element.id)
        window.app.sidepanel.showGlobalMenu()
      }
      // console.log(event)
    })
  }

  /*
  uuid () {
    let dt = Date.now()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (dt + Math.random() * 16) % 16 | 0
      dt = Math.floor(dt / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
  }
  */

  generateActivityID () {
    let i = 0
    while (true) {
      const id = `A${i}`
      let found = false
      for (const key in this.activities) {
        if (this.activities[key].id === id) {
          found = true
          break
        }
      }
      if (!found) return id
      i++
    }
  }

  generateConstraintID () {
    let i = 0
    while (true) {
      const id = `C${i}`
      let found = false
      for (const key in this.constraints) {
        if (this.constraints[key].id === id) {
          found = true
          break
        }
      }
      if (!found) return id
      i++
    }
  }

  /*
  generateID () {
    let uuid = 0
    while (true) {
      uuid++
      let found = false
      for (const key in this.activities) {
        if (this.activities[key].id === uuid) {
          found = true
          break
        }
      }
      if (found) continue
      for (const key in this.constraints) {
        if (this.constraints[key].id === uuid) {
          found = true
          break
        }
      }
      if (!found) return uuid
    }
  }
  */

  /*
  ACTIVITIES
  */
  getActivities () {
    const list = Object.values(this.activities).sort((a, b) => a.id - b.id)
    return (list === null) ? [] : list
  }

  getActivity (activityId) {
    return this.activities[activityId]
  }

  getActivitiesFromName (name) {
    const list = Object.values(this.activities).filter(a => a.name === name)
    if (list.length === 0) return undefined
    return list[0]
  }

  createActivity (id, position, select = false) {
    if (id === undefined || id === null) id = this.generateActivityID()
    this.activities[id] = new Activity(id, position)
    if (select) this.selectElement(id)
    this.saveModelToCache()
    window.app.sidepanel.updateGlobalMenu()
    return this.activities[id]
  }

  deleteActivity (activityId) {
    const a = this.activities[activityId]
    if (a.id === this.selectedElement) this.selectedElement = null
    this.getConstraintsOfActivity(activityId).forEach(c => this.deleteConstraint(c.id))
    a.delete()
    delete this.activities[activityId]
    this.saveModelToCache()
    window.app.sidepanel.updateGlobalMenu()
  }

  /*
  CONSTRAINTS
  */
  getConstraints () {
    const list = Object.values(this.constraints).sort((a, b) => {
      return a.type.name.localeCompare(b.type.name)
    })
    return (list == null) ? [] : list
  }

  getConstraint (constraintId) {
    return this.constraints[constraintId]
  }

  getConstraintsOfActivity (activityId) {
    return Object.values(this.constraints)
      .filter(c => { return c.sourceId === activityId || c.targetId === activityId })
  }

  createConstraint (id, sourceId, targetId, type, props = {}, select = false) {
    if (id === undefined || id === null) id = this.generateConstraintID()

    // targetId is null or undefined in case of a single activity constraints (e.g., Absence)
    if (targetId === undefined) targetId = null

    this.constraints[id] = new Constraint(id, sourceId, targetId, type, props)
    this.getActivity(sourceId).addConstraint(id)
    if (targetId !== null) this.getActivity(targetId).addConstraint(id) // targetId is null in case of a single activity constraints (e.g., Absence)
    if (select && targetId !== null) this.selectElement(id)
    this.saveModelToCache()

    this.updateConstraintStyles(sourceId, targetId)
    window.app.sidepanel.updateGlobalMenu()
    return this.constraints[id]
  }

  deleteConstraint (constraintId) {
    const c = this.getConstraint(constraintId)
    if (c.id === this.selectedElement) this.selectedElement = null
    this.activities[c.sourceId].removeConstraint(c.id)
    if (c.targetId !== null) this.activities[c.targetId].removeConstraint(c.id)
    c.delete()
    delete this.constraints[constraintId]
    this.saveModelToCache()
    this.updateConstraintStyles(c.sourceId, c.targetId)
    window.app.sidepanel.updateGlobalMenu()
  }

  swapConstraintActivities (constraintId) {
    const c = this.getConstraint(constraintId)
    const newSourceId = c.targetId
    const newTargetId = c.sourceId
    const type = c.type
    //
    if (c.id === this.selectedElement) this.selectedElement = null
    this.activities[c.sourceId].removeConstraint(c.id)
    this.activities[c.targetId].removeConstraint(c.id)
    c.delete()
    delete this.constraints[constraintId]
    //
    this.createConstraint(constraintId, newSourceId, newTargetId, type, {}, true)
  }

  updateConstraintStyles (activityId1, activityId2) {
    if (activityId1 === null || activityId2 === null) return
    const constraints = Object.values(this.constraints).filter(c => (c.sourceId === activityId1 && c.targetId === activityId2) || (c.sourceId === activityId2 && c.targetId === activityId1))
    constraints.forEach((c, i) => {
      c.updateLineStyle(i)
    })
  }

  /*
  * SELECTION
  */
  getElement (elementId) {
    const activity = this.getActivity(elementId)
    if (activity !== undefined) return activity
    const constraint = this.getConstraint(elementId)
    return constraint
  }

  selectElement (elementId) {
    if (this.selectedElement != null) this.getElement(this.selectedElement).setSelected(false)
    this.selectedElement = elementId
    const element = this.getElement(elementId).setSelected(true)
    // console.log(elementId, element)
    if (element instanceof Activity) window.app.sidepanel.showActivityMenu(element)
    if (element instanceof Constraint) window.app.sidepanel.showConstraintMenu(element)
    return this
  }

  deselectAll () {
    if (this.selectedElement != null) this.getElement(this.selectedElement).setSelected(false)
    this.selectedElement = null
    window.app.sidepanel.showGlobalMenu()
    return this
  }

  deleteCurrentSelectedElement () {

  }

  toModel () {
    const model = new Model()

    model.id(this.modelId)
      .name(this.modelName)
      .activities(this.getActivities().map(a => a.toActivityModel()))
      .constraints(this.getConstraints().map(c => c.toConstraintModel()))

    return model
  }

  /*
  MODEL

  getXML () {
    const id = this.modelId
    const name = this.modelName
    const activities = this.getActivities()
    const constraints = this.getConstraints()
    const model = new XMLModel().id(id).name(name).activities(activities).constraints(constraints)
    return model.toString()
  }

  getJson () {
    const id = this.modelId
    const name = this.modelName
    const activities = this.getActivities()
    const constraints = this.getConstraints()
    const model = new JSONModel().id(id).name(name).activities(activities).constraints(constraints)
    return model.toString()
  }
  */

  loadModelFromCache () {
    let model = null
    const str = window.localStorage.getItem(this.cacheKey)
    if (str == null) return null
    try {
      model = Model.fromString(str)
    } catch (exception) {
      console.warn(exception)
      this.clearCache()
    }
    return model
  }

  saveModelToCache () {
    const model = this.toModel()
    // console.log(model)
    const str = model.toString()
    window.localStorage.setItem(this.cacheKey, str)
  }

  clearCache () {
    window.localStorage.removeItem(this.cacheKey)
  }
}
