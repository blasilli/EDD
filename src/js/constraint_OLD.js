import * as d3 from 'd3'
import tippy from 'tippy.js'
import constraintTypes, { getConstraintType } from './constraintTypes'
import 'tippy.js/dist/tippy.css' // optional for styling
import '../styles/constraint.scss'

export default class ConstraintOLD {
  constructor (id, sourceId, targetId, type) {
    this.id = id
    this.type = (type === undefined) ? constraintTypes.Relation.Response : getConstraintType(type)
    this.sourceId = sourceId
    this.targetId = targetId
    this.selected = false

    if (this.targetId === null) return // A single activity constraint, e.g. Absence. It does not require to be plotted by this class but by the activity

    const rectLineGenerator = d3.line().curve(d3.curveBasis).x(d => d.x).y(d => d.y)
    const smoothLineGenerator = function (source, target) {
      return 'M' + target.x + ',' + target.y +
              'C' + (target.x + source.x) / 2 + ',' + target.y +
              ' ' + (target.x + source.x) / 2 + ',' + source.y +
              ' ' + source.x + ',' + source.y
    }

    this.svg = {
      smoothLine: false,
      g: undefined,
      lineGenerator: (source, target) => {
        if (this.svg.smoothLine) return smoothLineGenerator(source, target)
        else return rectLineGenerator([source, target])
      },
      iconPositioner: (source, target) => {
        return {
          x: (source.x + target.x) / 2 - this.size.icon / 2,
          y: (source.y + target.y) / 2 - this.size.icon / 2
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
    this.svg.icon = this.svg.g
      .append('g')
      .attr('class', 'icon')
      .on('click', () => this.onClick())

    this.svg.iconContent = this.svg.icon.append('svg')
      .attr('class', 'icon-content')
      .attr('width', this.size.icon)
      .attr('height', this.size.icon)
      .attr('viewBox', this.type.iconViewBox)
      .html(this.type.icon)

    // this.createTooltip();
    this.updatePosition()
    return this
  }

  createOverviewElement () {
    this.svg.overview = window.app.canvas.overview.gConstraints.append('path')
      .attr('class', 'line')
      .attr('stroke-width', this.size.line)
    return this
  }

  createTooltip () {
    let template = d3.select('#constraint-tooltip-template').node()
    template = d3.select(template.parentNode.insertBefore(template.cloneNode(true), template.nextSibling))
    template.attr('id', `tooltip-${this.id}"`)
    template.select('.constraint-id').text(this.id)
    template.select('.delete-constraint')
      .on('click', () => {
        this.svg.tooltip.hide()
        window.app.data.deleteConstraint(this.id)
      })

    this.svg.tooltip = tippy(this.svg.icon.node(), {
      placement: 'right',
      interactive: true,
      arrow: true,
      delay: [800, 0],
      content: template.node(),
      onShow: () => {
        this.showSelectionBorder(true)
      },
      onHide: () => {
        this.showSelectionBorder(false)
      }
    })
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
