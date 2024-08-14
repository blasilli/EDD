import Constraint from './constraint'
import Activity from './activity'
import { getConstraintType } from './constraintTypes'

class Model {
  constructor (str) {
    this.data = {
      id: null,
      name: null,
      activities: [],
      constraints: []
    }
  }

  id (value) {
    if (value === undefined) return this.data.id
    this.data.id = value
    return this
  }

  name (value) {
    if (value === undefined) return this.data.name
    this.data.name = value
    return this
  }

  activities (value) {
    if (value === undefined) return this.data.activities
    this.data.activities = value.map(a => new ActivityModel(a))
    return this
  }

  constraints (value) {
    if (value === undefined) return this.data.constraints
    this.data.constraints = value.map(c => new ConstraintModel(c))
    return this
  }

  toString () {
    return null
  }
}
/*
*/
export class JSONModel extends Model {
  constructor (jsonString) {
    super(jsonString)
    if (jsonString !== undefined) {
      try {
        this.parseString(jsonString)
      } catch (e) {
        console.warn(e)
        throw new Error('Not a valid json input file.')
      }
    }
  }

  toString () {
    const json = {
      type: 'VERTO',
      version: '1.0',
      modelId: this.data.id,
      modelName: this.data.name,
      activities: this.data.activities.map(a => a.toObject()),
      constraints: this.data.constraints.map(c => c.toObject())
    }
    return JSON.stringify(json)
  }

  parseString (string) {
    const json = JSON.parse(string)
    if (json.type !== 'VERTO') throw new Error('Not a valid input file. Missing type attribute.')
    if (json.version === undefined) throw new Error('Not a valid input file. Missing version attribute.')
    if (json.modelName === undefined) throw new Error('Not a valid input file. Missing modelName attribute.')
    if (json.activities === undefined || !Array.isArray(json.activities)) throw new Error('Not a valid input file. Missing activities attribute.')
    if (json.constraints === undefined || !Array.isArray(json.constraints)) throw new Error('Not a valid input file. Missing constraints attribute.')

    this.data.id = json.modelId
    this.data.name = json.modelName
    this.data.activities = json.activities.map(a => new ActivityModel(JSON.stringify(a)))
    this.data.constraints = json.constraints.map(c => new ConstraintModel(JSON.stringify(c)))
  }
}
/*
*/
export class XMLModel extends Model {
  constructor (xmlString) {
    super(xmlString)
    if (xmlString !== undefined) {
      try {
        this.parseString(xmlString)
      } catch (e) {
        console.warn(e)
        throw new Error('Not a valid xml input file.')
      }
    }
  }

  toString () {
    const activities = this.data.activities.map(a => a.toXML().definition).join('\n')
    const constraints = this.data.constraints.map(c => c.toXML().definition).join('\n')
    const activitiesGraphical = this.data.activities.map(a => a.toXML().graphical).join('\n')
    const constraintsGraphical = this.data.constraints.map(c => c.toXML().graphical).join('\n')
    const xml = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<model>
  <assignment language="ConDec" name="${this.data.name}" ident="${this.data.id}">
      <activitydefinitions>
          ${activities}
      </activitydefinitions>
      <constraintdefinitions>
          ${constraints}
      </constraintdefinitions>
      <data/>
      <team/>
      <graphical>
          <activities>
              ${activitiesGraphical}
          </activities>
          <constraints>
              ${constraintsGraphical}
          </constraints>
      </graphical>
  </assignment>
</model>
`
    return xml
  }

  parseString (string) {
    const xml = new window.DOMParser().parseFromString(string, 'text/xml')
    if (xml.documentElement.nodeName === 'parsererror') throw new Error('parser error')
    const data = this.getJXONData(xml)
    console.log(data)

    if (data.model === undefined) throw new Error('parser error')
    if (data.model.assignment === undefined) throw new Error('parser error')
    if (data.model.assignment.language !== 'ConDec') throw new Error('parser error')
    if (data.model.assignment.activitydefinitions === undefined) throw new Error('parser error')
    if (data.model.assignment.constraintdefinitions === undefined) throw new Error('parser error')
    this.data.id = data.model.assignment.ident
    this.data.name = data.model.assignment.name
    // activities
    const activities = {}
    if (data.model.assignment.activitydefinitions.activity !== undefined) {
      if (!Array.isArray(data.model.assignment.activitydefinitions.activity)) {
        data.model.assignment.activitydefinitions.activity = [JSON.parse(JSON.stringify(data.model.assignment.activitydefinitions.activity))]
      }
      data.model.assignment.activitydefinitions.activity.forEach(a => {
        activities[a.id] = {
          id: a.id,
          name: a.name
        }
      })
    };
    if (data.model.assignment.graphical !== undefined && data.model.assignment.graphical.activities !== undefined) {
      if (data.model.assignment.graphical.activities.cell !== undefined) {
        if (!Array.isArray(data.model.assignment.graphical.activities.cell)) {
          data.model.assignment.graphical.activities.cell = [JSON.parse(JSON.stringify(data.model.assignment.graphical.activities.cell))]
        }
        data.model.assignment.graphical.activities.cell.forEach(c => {
          activities[c.id].x = c.x
          activities[c.id].y = c.y
          activities[c.id].width = c.width
          activities[c.id].height = c.height
        })
      }
    };
    this.data.activities = Object.values(activities).map(a => {
      const m = new Map()
      Object.entries(a).forEach(e => m.set(e[0], e[1]))
      return new ActivityModel(new Map(m))
    })
    // constraints
    const constraints = {}
    if (data.model.assignment.constraintdefinitions.constraint !== undefined) {
      if (!Array.isArray(data.model.assignment.constraintdefinitions.constraint)) {
        data.model.assignment.constraintdefinitions.constraint = [JSON.parse(JSON.stringify(data.model.assignment.constraintdefinitions.constraint))]
      }
      data.model.assignment.constraintdefinitions.constraint.forEach(c => {
        if (c.constraintparameters !== undefined && c.constraintparameters.parameter !== undefined) {
          constraints[c.id] = {
            id: c.id,
            xmlName: c.name
          }
          if (c.constraintparameters.parameter.length !== 2) throw new Error('parser error (constraintparameters.parameter.length != 2)')
          constraints[c.id].sourceActivityName = c.constraintparameters.parameter[0].branches.branch.name
          constraints[c.id].targetActivityName = c.constraintparameters.parameter[1].branches.branch.name
          constraints[c.id].sourceActivityId = this.data.activities.filter(a => a.name === constraints[c.id].sourceActivityName)[0].id
          constraints[c.id].targetActivityId = this.data.activities.filter(a => a.name === constraints[c.id].targetActivityName)[0].id
        }
      })
    };
    if (data.model.assignment.graphical !== undefined && data.model.assignment.graphical.constraints !== undefined) {
      if (data.model.assignment.graphical.constraints.cell !== undefined) {
        if (!Array.isArray(data.model.assignment.graphical.constraints.cell)) {
          data.model.assignment.graphical.constraints.cell = [JSON.parse(JSON.stringify(data.model.assignment.graphical.constraints.cell))]
        }
        data.model.assignment.graphical.constraints.cell.forEach(c => {
          constraints[c.id].x = c.x
          constraints[c.id].y = c.y
        })
      }
    };

    this.data.constraints = Object.values(constraints).map(c => {
      const m = new Map()
      Object.entries(c).forEach(e => m.set(e[0], e[1]))
      return new ConstraintModel(new Map(m))
    })
    //
  }

  getJXONData (oXMLParent) {
    function buildValue (sValue) {
      if (/^\s*$/.test(sValue)) { return null }
      if (/^(true|false)$/i.test(sValue)) { return sValue.toLowerCase() === 'true' }
      if (isFinite(sValue)) { return parseFloat(sValue) }
      if (isFinite(Date.parse(sValue))) { return new Date(sValue) }
      return sValue
    }
    let vResult = /* put here the default value for empty nodes! */ null; let nLength = 0; let sCollectedTxt = ''
    if (oXMLParent.attributes !== undefined && oXMLParent.attributes.length > 0) {
      vResult = {}
      for (nLength; nLength < oXMLParent.attributes.length; nLength++) {
        const oItAttr = oXMLParent.attributes.item(nLength)
        vResult[oItAttr.nodeName.toLowerCase()] = buildValue(oItAttr.nodeValue.replace(/^\s+|\s+$/g, ''))
        if (oItAttr.nodeName === 'name') vResult[oItAttr.nodeName.toLowerCase()] = oXMLParent.getAttribute('name')
      }
    }
    if (oXMLParent.hasChildNodes()) {
      for (let oItChild, sItKey, sItVal, nChildId = 0; nChildId < oXMLParent.childNodes.length; nChildId++) {
        oItChild = oXMLParent.childNodes.item(nChildId)
        if (oItChild.nodeType === 4) { /* nodeType is "CDATASection" (4) */
          sCollectedTxt += oItChild.nodeValue
        } else if (oItChild.nodeType === 3) { /* nodeType is "Text" (3) */
          sCollectedTxt += oItChild.nodeValue.replace(/^\s+|\s+$/g, '')
        } else if (oItChild.nodeType === 1 && !oItChild.prefix) {
          /* nodeType is "Element" (1) */
          if (nLength === 0) { vResult = {} }
          sItKey = oItChild.nodeName.toLowerCase()
          sItVal = this.getJXONData(oItChild)
          if (Object.prototype.hasOwnProperty.call(vResult, sItKey)) {
            if (vResult[sItKey].constructor !== Array) { vResult[sItKey] = [vResult[sItKey]] }
            vResult[sItKey].push(sItVal)
          } else { vResult[sItKey] = sItVal; nLength++ }
        }
      }
    }
    if (sCollectedTxt) { nLength > 0 ? vResult.keyValue = buildValue(sCollectedTxt) : vResult = buildValue(sCollectedTxt) }
    /* if (nLength > 0) { Object.freeze(vResult); } */
    return vResult
  }
}
/*
*/
class ActivityModel {
  constructor (activity) {
    this.id = null
    this.name = null
    this.x = null
    this.y = null
    this.width = null
    this.height = null

    if (activity !== undefined && activity !== null) {
      if (activity instanceof Activity) {
        this.id = activity.id
        this.name = activity.name
        this.x = activity._svg.x
        this.y = activity._svg.y
        this.width = activity._size.width
        this.height = activity._size.height
      } else if (typeof activity === 'string') { // from json parser
        activity = JSON.parse(activity)
        this.id = activity.id
        this.name = activity.name
        this.x = activity.graphical.x
        this.y = activity.graphical.y
        this.width = activity.graphical.width
        this.height = activity.graphical.height
      } else if (activity instanceof Map) { // from xml parser
        for (const k of activity.keys()) {
          this[k] = activity.get(k)
        }
      } else {
        console.error('Not a valid input file.', activity)
        throw new Error('Not a valid input file.', activity)
      }
    }
  }

  toXML () {
    const definition = `
      <activity id="${this.id}" name="${this.name}">
          <authorization/>
          <datamodel/>
      </activity>
      `
    const graphical = `
          <cell height="${this.height}" id="${this.id}" width="${this.width}" x="${this.x}" y="${this.y}"/>
      `
    return {
      definition,
      graphical
    }
  }

  toObject () {
    return JSON.parse(JSON.stringify({
      id: this.id,
      name: this.name,
      graphical: {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      }
    }))
  }

  toJSON () {
    return JSON.stringify(this.toObject())
  }
}
/*
*/
class ConstraintModel {
  constructor (constraint) {
    this.id = null
    this.xmlName = null
    this.type = null
    this.sourceActivityId = null
    this.targetActivityId = null
    this.sourceActivityName = null
    this.targetActivityName = null
    this.x = null
    this.y = null

    if (constraint instanceof Constraint) {
      // console.log(constraint)
      const sourceActivity = constraint.getSourceActivity()
      const targetActivity = constraint.getTargetActivity()
      const position = constraint.getPosition()
      // const iconPosition = (targetActivity === null) ? { x: 0, y: 0 } : constraint.svg.iconPositioner(sourceActivity.getAnchors().center, targetActivity.getAnchors().center)
      this.id = constraint.id
      this.type = constraint.type
      this.xmlName = constraint.type.xmlName
      this.sourceActivityId = sourceActivity.id
      this.sourceActivityName = sourceActivity.name
      this.targetActivityId = (targetActivity === null) ? null : targetActivity.id
      this.targetActivityName = (targetActivity === null) ? null : targetActivity.name
      this.x = position.x
      this.y = position.y
      this.props = constraint.props
    } else if (typeof constraint === 'string') { // from json parser
      constraint = JSON.parse(constraint)
      this.id = constraint.id
      this.type = getConstraintType(constraint.xmlName)
      this.xmlName = constraint.xmlName
      this.sourceActivityId = constraint.sourceActivityId
      this.targetActivityId = constraint.targetActivityId
      this.sourceActivityName = constraint.sourceActivityName
      this.targetActivityName = constraint.targetActivityName
      this.x = constraint.graphical.x
      this.y = constraint.graphical.y
      this.props = constraint.props
    } else if (constraint instanceof Map) { // from xml parser
      this.id = constraint.get('id')
      this.type = getConstraintType(constraint.get('xmlName'))
      this.xmlName = constraint.get('xmlName')
      this.sourceActivityName = constraint.get('sourceActivityName')
      this.targetActivityName = constraint.get('targetActivityName')
      this.sourceActivityId = constraint.get('sourceActivityId')
      this.targetActivityId = constraint.get('targetActivityId')
      this.x = constraint.get('x')
      this.y = constraint.get('y')
      this.props = constraint.props
    } else {
      console.error('Not a valid input file.', constraint)
      throw new Error('Not a valid input file.', constraint)
    }
  }

  toXML () {
    const definition = this.type.getXML(
      this.id,
      this.sourceActivityId,
      this.sourceActivityName,
      this.targetActivityId,
      this.targetActivityName
    )
    const graphical = `
          <cell height="1.0" id="${this.id}" width="1.0" x="${this.x}" y="${this.y}"/>
      `
    return {
      definition,
      graphical
    }
  }

  toObject () {
    return JSON.parse(JSON.stringify({
      id: this.id,
      xmlName: this.xmlName,
      sourceActivityId: this.sourceActivityId,
      sourceActivityName: this.sourceActivityName,
      targetActivityId: this.targetActivityId,
      targetActivityName: this.targetActivityName,
      props: this.props,
      graphical: {
        x: this.x,
        y: this.y
      }
    }))
  }

  toJSON () {
    return JSON.stringify(this.toObject())
  }
}
