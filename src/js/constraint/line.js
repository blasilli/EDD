import * as d3 from 'd3'
import constraintTypes, { getConstraintType } from '../constraintTypes'
import '../../styles/constraint.scss'
import { straightLine, curveLineA, curveLineB } from './geometry'

export default class ConstraintLine {
  constructor (id, sourceId, targetId, type) {
    this.id = id
    this.type = (type === undefined) ? constraintTypes.Relation.Response : getConstraintType(type)
    this.sourceId = sourceId
    this.targetId = targetId
    this.selected = false
    this.lineStyle = 0

    /*
    const rectLineGenerator = d3.line().curve(d3.curveBasis).x(d => d.x).y(d => d.y)
    const smoothLineGenerator = function (source, target) {
      return 'M' + target.x + ',' + target.y +
              'C' + (target.x + source.x) / 2 + ',' + target.y +
              ' ' + (target.x + source.x) / 2 + ',' + source.y +
              ' ' + source.x + ',' + source.y
    }
    */

    const lineGeneratorFunctions = [
      (source, target) => straightLine(source, target).path,
      (source, target) => curveLineA(source, target, this.size.icon * 2.5).path,
      (source, target) => curveLineB(source, target, this.size.icon * 2.5).path
    ]

    const iconPositionerFunctions = [
      (source, target) => straightLine(source, target).midPoint,
      (source, target) => curveLineA(source, target, this.size.icon * 2.5).midPoint,
      (source, target) => curveLineB(source, target, this.size.icon * 2.5).midPoint
    ]

    this.svg = {
      // smoothLine: false,
      g: undefined,
      lineGenerator: (source, target) => {
        return lineGeneratorFunctions[this.lineStyle](source, target)
        // if (this.svg.smoothLine) return smoothLineGenerator(source, target)
        // else return rectLineGenerator([source, target])
      },
      iconPositioner: (source, target) => {
        const p = iconPositionerFunctions[this.lineStyle](source, target)
        return {
          x: p.x - this.size.icon / 2,
          y: p.y - this.size.icon / 2
          // x: (source.x + target.x) / 2 - this.size.icon / 2,
          // y: (source.y + target.y) / 2 - this.size.icon / 2
        }
      },
      angle: (source, target) => {
        if (source.x === target.x && target.y > source.y) return 90
        if (source.x === target.x && target.y < source.y) return -90
        const m = (target.y - source.y) / (target.x - source.x) // angular coefficient of the rect
        let angle = Math.atan(m) * 180 / Math.PI
        if (source.x > target.x) angle = 180 + angle
        return angle
      },
      line: undefined,
      selectionLine: undefined,
      icon: undefined,
      iconContent: undefined,
      tooltip: undefined,
      overview: undefined
    }
    this.size = {
      line: 2,
      selection: 6,
      icon: 30
    }
    this.createOverviewElement() // before create element because in createElement the position will be updated
    this.createElement()
  }

  delete () {
    this.svg.g.remove()
    this.svg.overview.remove()
    return this
  }

  getSourceActivity () {
    return window.app.data.getActivity(this.sourceId)
  }

  getTargetActivity () {
    if (this.targetId === null) return null
    return window.app.data.getActivity(this.targetId)
  }

  createElement () {
    this.svg.g = window.app.canvas.gConstraints.append('g')
      .attr('id', `constraint-${this.id}`)
      .attr('class', 'constraint')
    this.svg.selectionLine = this.svg.g.append('path')
      .attr('class', 'selection-line')
      .attr('stroke-width', this.size.selection)
      .style('display', 'none')
    this.svg.line = this.svg.g.append('path')
      .attr('class', 'line')
      .attr('stroke-width', this.size.line)
      .on('click', () => this.onClick())
    this.svg.icon = this.svg.g
      .append('g')
      .attr('class', 'icon')
      .on('click', () => this.onClick())

    this.svg.iconContent = this.svg.icon.append('svg')
      .attr('class', 'icon-content')
      .attr('width', this.size.icon)
      .attr('height', this.size.icon)
      .attr('viewBox', this.type.iconViewBox)
      .on('click', () => this.onClick())
      .html(this.type.icon)

    this.updatePosition()
    return this
  }

  createOverviewElement () {
    this.svg.overview = window.app.canvas.overview.gConstraints.append('path')
      .attr('class', 'line')
      .attr('stroke-width', this.size.line)
    return this
  }

  updateLineStyle (n) {
    this.lineStyle = n
    this.updatePosition()
  }

  updateType () {
    // disegna icona
    this.svg.iconContent.html(this.type.icon)
  }

  updatePosition (approximatePositioning = false) {
    // update according source and target position
    let pathString = null
    let iconPosition = null
    let angle = null
    const sourceActivity = window.app.data.getActivity(this.sourceId)
    const targetActivity = window.app.data.getActivity(this.targetId)
    if (approximatePositioning) {
      pathString = this.svg.lineGenerator(sourceActivity.getAnchors().center, targetActivity.getAnchors().center)
      iconPosition = this.svg.iconPositioner(sourceActivity.getAnchors().center, targetActivity.getAnchors().center)
      angle = this.svg.angle(sourceActivity.getAnchors().center, targetActivity.getAnchors().center)
    } else {
      // choice the best position, the one that minimizes the length of the link
      const sourcePositions = sourceActivity.getAnchors()
      const targetPositions = targetActivity.getAnchors()
      let sourceBest = null
      let targetBest = null
      let shortDistance = Infinity
      Object.keys(sourcePositions).forEach(sp => {
        Object.keys(targetPositions).forEach(tp => {
          // euclidean distance
          const d = Math.sqrt(Math.pow(sourcePositions[sp].x - targetPositions[tp].x, 2) + Math.pow(sourcePositions[sp].y - targetPositions[tp].y, 2))
          if (d < shortDistance) {
            shortDistance = d
            sourceBest = sp
            targetBest = tp
          }
        })
      })
      pathString = this.svg.lineGenerator(sourcePositions[sourceBest], targetPositions[targetBest])
      iconPosition = this.svg.iconPositioner(sourcePositions[sourceBest], targetPositions[targetBest])
      angle = this.svg.angle(sourcePositions[sourceBest], targetPositions[targetBest])
    }
    this.svg.overview.attr('d', pathString)
    this.svg.line.attr('d', pathString)
    this.svg.selectionLine.attr('d', pathString)
    this.svg.icon.attr('transform', `translate(${iconPosition.x} ${iconPosition.y}) rotate(${angle} ${this.size.icon / 2} ${this.size.icon / 2})`)
    return this
  }

  highlight (bool = true) {
    if (bool) {
      window.app.data.getActivities().forEach(a => {
        if ([this.sourceId, this.targetId].includes(a.id)) return
        a.partiallyHide(true)
      })
      window.app.data.getConstraints().forEach(c => {
        if (this.id === c.id) return
        c.partiallyHide(true)
      })
    } else {
      window.app.data.getActivities().forEach(a => {
        if ([this.sourceId, this.targetId].includes(a.id)) return
        a.partiallyHide(false)
      })
      window.app.data.getConstraints().forEach(c => {
        if (this.id === c.id) return
        c.partiallyHide(false)
      })
    }
  }

  onClick () {
    window.app.data.selectElement(this.id)
  }

  onMouseover () {
    this.highlight(true)
  }

  onMouseout () {
    this.highlight(false)
  }

  showSelectionBorder (bool = true) {
    if (bool) this.svg.selectionLine.style('display', null)
    else this.svg.selectionLine.style('display', 'none')
    return this
  }

  setSelected (bool = true) {
    this.selected = bool
    this.showSelectionBorder(bool)
    return this
  }

  partiallyHide (bool = true) {
    if (bool) this.svg.g.transition().style('opacity', 0.2)
    else this.svg.g.transition().style('opacity', 1)
    return this
  }

  setType (type) {
    this.type = type
    this.updateType()
    this.afterUpdate()
    return this
  }

  afterUpdate () {
    window.app.data.saveModelToCache()
  }
}
