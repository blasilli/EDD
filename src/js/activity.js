import * as d3 from 'd3'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css' // optional for styling
import '../styles/activity.scss'
import { ActivityModel } from './model'

export default class Activity {
  constructor (id, position) {
    this.id = id
    this.name = `activity ${id}`
    this.constraints = new Set()
    this.selected = false

    if (position === undefined) {
      position = { x: 200 + parseInt(Math.random() * 500), y: 200 + parseInt(Math.random() * 500) }
    }
    /*
      * Private fields.
      */
    this._size = {
      width: 140, // 140
      height: 60, // 60
      minWidth: 50,
      minHeight: 50,
      handles: 15,
      border: 2,
      borderRadious: 5,
      text: 8,
      link: 3,
      absenceBox: {
        width: 60,
        height: 20,
        text: 12,
        border: 1
      },
      existenceBox: {
        width: 60,
        height: 20,
        text: 12,
        border: 1
      },
      initBox: {
        width: 40,
        height: 20,
        text: 12,
        border: 1
      },
      endBox: {
        width: 40,
        height: 20,
        text: 12,
        border: 1
      }
    }
    this._svg = { // all variable regarding svg
      g: undefined,
      background: undefined,
      border: undefined,
      selectionBorder: undefined,
      dragBorder: undefined,
      text: undefined,
      handles: {
        g: undefined,
        top: {
          area: undefined,
          arrow: undefined
        },
        right: {
          area: undefined,
          arrow: undefined
        },
        bottom: {
          area: undefined,
          arrow: undefined
        },
        left: {
          area: undefined,
          arrow: undefined
        }
      },
      tooltip: undefined,
      absenceBox: {
        g: undefined,
        rect: undefined,
        text: undefined,
        border: undefined
      },
      existenceBox: {
        g: undefined,
        rect: undefined,
        text: undefined,
        border: undefined
      },
      initBox: {
        g: undefined,
        rect: undefined,
        text: undefined,
        border: undefined
      },
      endBox: {
        g: undefined,
        rect: undefined,
        text: undefined,
        border: undefined
      },
      x: position.x, // - this._size.width/2,
      y: position.y, // - this._size.height/2,
      overview: undefined
    }

    this._tempLink = undefined
    this._tempLinkDestination = undefined
    this._createElement()
    this._createOverviewElement()
  }

  /*
  */
  delete () {
    this._svg.g.remove()
    this._svg.overview.remove()
  }

  /*
  */
  _createElement () {
    this._svg.g = window.app.canvas.gActivities.append('g')
      .attr('id', 'activity-' + this.id)
      .attr('class', 'activity')
      .attr('transform', 'translate(' + this._svg.x + ' ' + this._svg.y + ')')
      // selection-border
    this._svg.selectionBorder = this._svg.g.append('rect')
      .attr('class', 'selection-border')
      .attr('x', -this._size.border)
      .attr('y', -this._size.border)
      .attr('width', this._size.width + 2 * this._size.border)
      .attr('height', this._size.height + 2 * this._size.border)
      .attr('rx', this._size.borderRadious)
      .attr('ry', this._size.borderRadious)
      .style('display', 'none')
      // drag-border
    this._svg.dragBorder = this._svg.g.append('rect')
      .attr('class', 'drag-border')
      .attr('x', -this._size.border)
      .attr('y', -this._size.border)
      .attr('width', this._size.width + 2 * this._size.border)
      .attr('height', this._size.height + 2 * this._size.border)
      .attr('rx', this._size.borderRadious)
      .attr('ry', this._size.borderRadious)
      .style('display', 'none')
      // border
    this._svg.border = this._svg.g.append('rect')
      .attr('class', 'border')
      .attr('width', this._size.width)
      .attr('height', this._size.height)
      .attr('rx', this._size.borderRadious)
      .attr('ry', this._size.borderRadious)
      // background
    this._svg.background = this._svg.g.append('rect')
      .attr('class', 'background')
      .attr('width', this._size.width - 2 * this._size.border)
      .attr('height', this._size.height - 2 * this._size.border)
      .attr('x', this._size.border)
      .attr('y', this._size.border)
      .attr('rx', this._size.borderRadious - 1)
      .attr('ry', this._size.borderRadious - 1)
      .on('click', (event) => this._onClick(event))
    // .on("mouseover", () => this._onMouseover())
    // .on("mouseout", () => this._onMouseout())
      .call(
        d3.drag()
          .on('start', () => this._onDragStart())
          .on('drag', (event) => this._onDrag(event))
          .on('end', () => this._onDragEnd())
      )
      // text
    this._svg.text = this._svg.g.append('foreignObject')
      .attr('class', 'name')
      .attr('width', this._size.width - 2 * this._size.border)
      .attr('height', this._size.height - 2 * this._size.border)
      .attr('x', this._size.border)
      .attr('y', this._size.border)
      .attr('pointer-events', 'none')
      .append('xhtml:div').attr('class', 'name-container')
      .append('xhtml:div').attr('class', 'name-text').style('text-width', this._size.text)
      .select(function () { return this.parentNode })
      .select(function () { return this.parentNode })

    // existence box

    this._createExistenceBox()
    this._createAbsenceBox()
    this._createInitBox()
    this._createEndBox()

    this._createHandles()
    // this._createTooltip();
    this._updateName()
    return this
  }

  /// ${-(this._size.border + (this._size.width - this._size.initBox.width) / 2) / 2} ,
  _createInitBox () {
    this._svg.initBox.g = this._svg.g.append('g')
      .attr('class', 'init-box')
      .attr('transform', `translate(
        ${0} , 
        ${-this._size.border + this._size.height - (this._size.initBox.height) / 2})`
      )
      .style('display', 'none')

    this._svg.initBox.border = this._svg.initBox.g.append('rect')
      .attr('class', 'init-box-border')
      .attr('width', this._size.initBox.width + 2 * this._size.initBox.border)
      .attr('height', this._size.initBox.height + 2 * this._size.initBox.border)
      .attr('x', -this._size.initBox.border)
      .attr('y', -this._size.initBox.border)
      .attr('rx', this._size.borderRadious - 1)
      .attr('ry', this._size.borderRadious - 1)

    this._svg.initBox.rect = this._svg.initBox.g.append('rect')
      .attr('class', 'init-box-rect')
      .attr('width', this._size.initBox.width)
      .attr('height', this._size.initBox.height)
      .attr('x', 0)
      .attr('y', 0)
      .attr('rx', this._size.borderRadious - 1)
      .attr('ry', this._size.borderRadious - 1)

    this._svg.initBox.text = this._svg.initBox.g.append('text')
      .attr('class', 'init-box-text')
      .attr('width', this._size.initBox.width)
      .attr('height', this._size.initBox.height)
      .attr('x', this._size.initBox.width / 2)
      .attr('y', this._size.initBox.height / 2)
      .attr('font-size', this._size.initBox.text)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text('INIT')
  }

  _createEndBox () {
    this._svg.endBox.g = this._svg.g.append('g')
      .attr('class', 'end-box')
      .attr('transform', `translate(
        ${this._size.width - this._size.endBox.width} , 
        ${-this._size.border + this._size.height - (this._size.endBox.height) / 2})`
      )
      .style('display', 'none')

    this._svg.endBox.border = this._svg.endBox.g.append('rect')
      .attr('class', 'end-box-border')
      .attr('width', this._size.endBox.width + 2 * this._size.endBox.border)
      .attr('height', this._size.endBox.height + 2 * this._size.endBox.border)
      .attr('x', -this._size.endBox.border)
      .attr('y', -this._size.endBox.border)
      .attr('rx', this._size.borderRadious - 1)
      .attr('ry', this._size.borderRadious - 1)

    this._svg.endBox.rect = this._svg.endBox.g.append('rect')
      .attr('class', 'init-box-rect')
      .attr('width', this._size.endBox.width)
      .attr('height', this._size.endBox.height)
      .attr('x', 0)
      .attr('y', 0)
      .attr('rx', this._size.borderRadious - 1)
      .attr('ry', this._size.borderRadious - 1)

    this._svg.endBox.text = this._svg.endBox.g.append('text')
      .attr('class', 'end-box-text')
      .attr('width', this._size.endBox.width)
      .attr('height', this._size.endBox.height)
      .attr('x', this._size.endBox.width / 2)
      .attr('y', this._size.endBox.height / 2)
      .attr('font-size', this._size.endBox.text)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text('END')
  }

  _createAbsenceBox () {
    // absence box
    this._svg.absenceBox.g = this._svg.g.append('g')
      .attr('class', 'absence-box')
      .attr('transform', `translate(
        ${this._size.border + (this._size.width - this._size.absenceBox.width) / 2}, 
        ${this._size.border - (this._size.absenceBox.height) / 2})`
      )
      .style('display', 'none')

    this._svg.absenceBox.border = this._svg.absenceBox.g.append('rect')
      .attr('class', 'absence-box-border')
      .attr('width', this._size.absenceBox.width + 2 * this._size.absenceBox.border)
      .attr('height', this._size.absenceBox.height + 2 * this._size.absenceBox.border)
      .attr('x', -this._size.absenceBox.border)
      .attr('y', -this._size.absenceBox.border)
      .attr('rx', this._size.borderRadious - 1)
      .attr('ry', this._size.borderRadious - 1)

    this._svg.absenceBox.rect = this._svg.absenceBox.g.append('rect')
      .attr('class', 'absence-box-rect')
      .attr('width', this._size.absenceBox.width)
      .attr('height', this._size.absenceBox.height)
      .attr('x', 0)
      .attr('y', 0)
      .attr('rx', this._size.borderRadious - 1)
      .attr('ry', this._size.borderRadious - 1)

    this._svg.absenceBox.text = this._svg.absenceBox.g.append('text')
      .attr('class', 'absence-box-text')
      .attr('width', this._size.absenceBox.width)
      .attr('height', this._size.absenceBox.height)
      .attr('x', this._size.absenceBox.width / 2)
      .attr('y', this._size.absenceBox.height / 2)
      .attr('font-size', this._size.absenceBox.text)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text('0')
  }

  _createExistenceBox () {
    this._svg.existenceBox.g = this._svg.g.append('g')
      .attr('class', 'existence-box')
      .attr('transform', `translate(
        ${this._size.border + (this._size.width - this._size.existenceBox.width) / 2}, 
        ${this._size.border - (this._size.existenceBox.height) / 2})`
      )
      .style('display', 'none')

    this._svg.existenceBox.border = this._svg.existenceBox.g.append('rect')
      .attr('class', 'existence-box-border')
      .attr('width', this._size.existenceBox.width + 2 * this._size.existenceBox.border)
      .attr('height', this._size.existenceBox.height + 2 * this._size.existenceBox.border)
      .attr('x', -this._size.existenceBox.border)
      .attr('y', -this._size.existenceBox.border)
      .attr('rx', this._size.borderRadious - 1)
      .attr('ry', this._size.borderRadious - 1)

    this._svg.existenceBox.rect = this._svg.existenceBox.g.append('rect')
      .attr('class', 'existence-box-rect')
      .attr('width', this._size.existenceBox.width)
      .attr('height', this._size.existenceBox.height)
      .attr('x', 0)
      .attr('y', 0)
      .attr('rx', this._size.borderRadious - 1)
      .attr('ry', this._size.borderRadious - 1)

    this._svg.existenceBox.text = this._svg.existenceBox.g.append('text')
      .attr('class', 'existence-box-text')
      .attr('width', this._size.existenceBox.width)
      .attr('height', this._size.existenceBox.height)
      .attr('x', this._size.existenceBox.width / 2)
      .attr('y', this._size.existenceBox.height / 2)
      .attr('font-size', this._size.existenceBox.text)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text('1...X')
  }

  _createOverviewElement () {
    this._svg.overview = window.app.canvas.overview.gActivities.append('rect')
      .attr('id', 'activity-' + this.id)
      .attr('class', 'activity')
      .attr('x', this._svg.x)
      .attr('y', this._svg.y)
      .attr('width', this._size.width - 2 * this._size.border)
      .attr('height', this._size.height - 2 * this._size.border)
    return this
  }

  /*
  */
  _createHandles () {
    this._svg.handles.g = this._svg.g.append('g').attr('class', 'handles')
    this._svg.handles.top.arrow = this._svg.handles.g.append('line')
      .attr('class', 'arrow h-top')
      .attr('x1', this._size.width / 2 + this._size.link / 2)
      .attr('y1', 0)
      .attr('x2', this._size.width / 2 + this._size.link / 2)
      .attr('y2', -this._size.handles)
      .attr('stroke-width', this._size.link)
      .attr('marker-end', 'url(#activity-handle-arrow)')
      .style('display', 'none')
    this._svg.handles.right.arrow = this._svg.handles.g.append('line')
      .attr('class', 'arrow h-right')
      .attr('x1', this._size.width)
      .attr('y1', this._size.height / 2 + this._size.link / 2)
      .attr('x2', this._size.width + this._size.handles)
      .attr('y2', this._size.height / 2 + this._size.link / 2)
      .attr('stroke-width', this._size.link)
      .attr('marker-end', 'url(#activity-handle-arrow)')
      .style('display', 'none')
    this._svg.handles.bottom.arrow = this._svg.handles.g.append('line')
      .attr('class', 'arrow h-bottom')
      .attr('x1', this._size.width / 2 + this._size.link / 2)
      .attr('y1', this._size.height)
      .attr('x2', this._size.width / 2 + this._size.link / 2)
      .attr('y2', this._size.height + this._size.handles)
      .attr('stroke-width', this._size.link)
      .attr('marker-end', 'url(#activity-handle-arrow)')
      .style('display', 'none')
    this._svg.handles.left.arrow = this._svg.handles.g.append('line')
      .attr('class', 'arrow h-left')
      .attr('x1', 0)
      .attr('y1', this._size.height / 2 + this._size.link / 2)
      .attr('x2', -this._size.handles)
      .attr('y2', this._size.height / 2 + this._size.link / 2)
      .attr('stroke-width', this._size.link)
      .attr('marker-end', 'url(#activity-handle-arrow)')
      .style('display', 'none')
    this._svg.handles.top.area = this._svg.handles.g.append('rect')
      .attr('class', 'area h-top')
      .attr('x', 0)
      .attr('y', -this._size.handles)
      .attr('width', this._size.width)
      .attr('height', this._size.handles)
      .on('mouseover', () => {
        if (window.app.canvas.status.creatingConstraint) return
        this._svg.handles.top.arrow.style('display', null)
      })
      .on('mouseout', () => {
        if (window.app.canvas.status.creatingConstraint) return
        this._svg.handles.top.arrow.style('display', 'none')
      })
      .call(d3.drag()
        .on('start', () => this._onDragStartConstraint(this._svg.handles.top))
        .on('drag', (event) => this._onDragConstraint(event, this._svg.handles.top))
        .on('end', () => this._onDragEndConstraint(this._svg.handles.top))
      )
    this._svg.handles.right.area = this._svg.handles.g.append('rect')
      .attr('class', 'area h-right')
      .attr('x', this._size.width)
      .attr('y', 0)
      .attr('width', this._size.handles)
      .attr('height', this._size.height)
      .on('mouseover', () => {
        if (window.app.canvas.status.creatingConstraint) return
        this._svg.handles.right.arrow.style('display', null)
      })
      .on('mouseout', () => {
        if (window.app.canvas.status.creatingConstraint) return
        this._svg.handles.right.arrow.style('display', 'none')
      })
      .call(d3.drag()
        .on('start', () => this._onDragStartConstraint(this._svg.handles.right))
        .on('drag', (event) => this._onDragConstraint(event, this._svg.handles.right))
        .on('end', () => this._onDragEndConstraint(this._svg.handles.right))
      )
    this._svg.handles.bottom.area = this._svg.handles.g.append('rect')
      .attr('class', 'area h-bottom')
      .attr('x', 0)
      .attr('y', this._size.height)
      .attr('width', this._size.width)
      .attr('height', this._size.handles)
      .on('mouseover', () => {
        if (window.app.canvas.status.creatingConstraint) return
        this._svg.handles.bottom.arrow.style('display', null)
      })
      .on('mouseout', () => {
        if (window.app.canvas.status.creatingConstraint) return
        this._svg.handles.bottom.arrow.style('display', 'none')
      })
      .call(d3.drag()
        .on('start', () => this._onDragStartConstraint(this._svg.handles.bottom))
        .on('drag', (event) => this._onDragConstraint(event, this._svg.handles.bottom))
        .on('end', () => this._onDragEndConstraint(this._svg.handles.bottom))
      )
    this._svg.handles.left.area = this._svg.handles.g.append('rect')
      .attr('class', 'area h-left')
      .attr('x', -this._size.handles)
      .attr('y', 0)
      .attr('width', this._size.handles)
      .attr('height', this._size.height)
      .on('mouseover', () => {
        if (window.app.canvas.status.creatingConstraint) return
        this._svg.handles.left.arrow.style('display', null)
      })
      .on('mouseout', () => {
        if (window.app.canvas.status.creatingConstraint) return
        this._svg.handles.left.arrow.style('display', 'none')
      })
      .call(d3.drag()
        .on('start', () => this._onDragStartConstraint(this._svg.handles.left))
        .on('drag', (event) => this._onDragConstraint(event, this._svg.handles.left))
        .on('end', () => this._onDragEndConstraint(this._svg.handles.left))
      )
      /*
    tippy(this._svg.handles.top.area.node(), {
      placement: 'top',
      distance: 20,
      arrow: true,
      content: 'Click and drag the arrow on another activity <br> to create a constraint',
      onShow: () => {
        if (window.app.data.getConstraints().length != 0) return false
          }
    })

      tippy(this._svg.handles.right.area.node(), {
          placement: "right",
          distance: 20,
          arrow: true,
          content: "Click and drag the arrow on another activity <br> to create a constraint",
          onShow: () => {
              if(window.app.data.getConstraints().length != 0) return false;
          }
      });
      tippy(this._svg.handles.left.area.node(), {
          placement: "left",
          distance: 20,
          arrow: true,
          content: "Click and drag the arrow on another activity <br> to create a constraint",
          onShow: () => {
              if(window.app.data.getConstraints().length != 0) return false;
          }
      });
      tippy(this._svg.handles.bottom.area.node(), {
          placement: "bottom",
          distance: 20,
          arrow: true,
          content: "Click and drag the arrow on another activity <br> to create a constraint",
          onShow: () => {
              if(window.app.data.getConstraints().length != 0) return false;
          }
      });
      */

    return this
  }

  _createTooltip () {
    const that = this
    let template = d3.select('#activity-tooltip-template').node()
    template = d3.select(template.parentNode.insertBefore(template.cloneNode(true), template.nextSibling))
    template.attr('id', `tooltip-${this.id}"`)
    template.select('.activity-id').text(this.id)
    template.select('.delete-activity')
      .on('click', () => {
        this._svg.tooltip.hide()
        window.app.data.deleteActivity(this.id)
      })
    let nameChanged = false
    template.select('.activity-name')
      .on('keyup', function () {
        nameChanged = true
        that.name = d3.select(this).property('value')
      })

    this._svg.tooltip = tippy(this._svg.background.node(), {
      placement: 'right',
      interactive: true,
      arrow: true,
      delay: [800, 0],
      content: template.node(),
      onShow: () => {
        this._showSelectionBorder(true)
      },
      onHide: () => {
        this._showSelectionBorder(false)
        if (!nameChanged) return
        nameChanged = false
        this._updateName()
      }
    })
  }

  highlight (bool = true) {
    if (bool) {
      window.app.data.getActivities().forEach(a => {
        if (a.id === this.id) return
        a.partiallyHide(true)
      })
      window.app.data.getConstraints().forEach(c => {
        if (this.constraints.has(c.id)) return
        c.partiallyHide(true)
      })
    } else {
      window.app.data.getActivities().forEach(a => {
        if (a.id === this.id) return
        a.partiallyHide(false)
      })
      window.app.data.getConstraints().forEach(c => {
        if (this.constraints.has(c.id)) return
        c.partiallyHide(false)
      })
    }
  }

  /*
  *
  *
  EVENT LISTENER
  *
  */
  _onClick (event) {
    if (event.defaultPrevented) return
    window.app.data.selectElement(this.id)
  }

  _onMouseover () {
    this.highlight(true)
  }

  _onMouseout () {
    this.highlight(false)
  }

  _onDragStart () {
    if (this._svg.tooltip !== undefined) this._svg.tooltip.hide()
    if (this._svg.tooltip !== undefined) this._svg.tooltip.disable()
    this._svg.g.classed('ondrag', true)
    this._showDragBorder()
    return this
  }

  _onDrag (event) {
    this._svg.x += event.x - this._size.width / 2
    this._svg.y += event.y - this._size.height / 2
    this._svg.g.attr('transform', 'translate(' + this._svg.x + ' ' + this._svg.y + ')')
    this._svg.overview.attr('x', this._svg.x).attr('y', this._svg.y)
    this.constraints.forEach(constraintId => window.app.data.getConstraint(constraintId).updatePosition(true))
    return this
  }

  _onDragEnd () {
    if (this._svg.tooltip !== undefined) this._svg.tooltip.hide()
    if (this._svg.tooltip !== undefined) this._svg.tooltip.enable()
    this._svg.g.classed('ondrag', false)
    this._showDragBorder(false)
    this.constraints.forEach(constraintId => window.app.data.getConstraint(constraintId).updatePosition(false))
    this.afterUpdate()
    return this
  }

  _onDragStartConstraint (source) {
    window.app.canvas.status.creatingConstraint = true
    this._showDragBorder()
    source.arrow.style('display', 'none')
    this._svg.g.style('cursor', 'pointer !important')
    this._tempLinkDestination = undefined
    this._tempLink = this._svg.g.append('line')
      .attr('class', 'constraint temp')
      .attr('stroke-width', this._size.link)
      .attr('marker-end', 'url(#activity-handle-arrow)')
      .attr('x1', this._size.width / 2)
      .attr('y1', this._size.height / 2)
    return this
  }

  _onDragConstraint (event) {
    this._tempLink.attr('x2', event.x).attr('y2', event.y)
    const p = {
      x: event.x + this._svg.x,
      y: event.y + this._svg.y
    }
    this._tempLinkDestination = undefined
    window.app.data.getActivities().forEach(a => {
      if (a.id === this.id) return
      a._showDragBorder(false)
      if (a._isPointInside(p.x, p.y)) {
        this._tempLinkDestination = a
        a._showDragBorder()
      }
    })
    return this
  }

  _onDragEndConstraint (source) {
    window.app.canvas.status.creatingConstraint = false
    this._showDragBorder(false)
    source.arrow.style('display', 'none')
    this._svg.g.style('cursor', 'default')
    this._tempLink.remove()
    if (this._tempLinkDestination !== undefined) {
      this._tempLinkDestination._showDragBorder(false)
      window.app.data.createConstraint(null, this.id, this._tempLinkDestination.id, undefined, {}, true)
      this._tempLink = undefined
      this._tempLinkDestination = undefined
    }
    return this
  }

  /*
  *
  GETTERS
  *
  */
  _getRelativeAnchors (dx = 0, dy = 0) {
    return {
      center: {
        x: dx + this._size.width / 2,
        y: dy + this._size.height / 2
      },
      top: {
        x: dx + this._size.width / 2,
        y: dy + this._size.border
      },
      right: {
        x: dx + this._size.width - this._size.border,
        y: dy + this._size.height / 2
      },
      bottom: {
        x: dx + this._size.width / 2,
        y: dy + this._size.height - this._size.border
      },
      left: {
        x: dx + this._size.border,
        y: dy + this._size.height / 2
      }
    }
  }

  getAnchors () {
    return this._getRelativeAnchors(this._svg.x, this._svg.y)
  }

  getConstraints () {
    return this.constraints
  }

  /*
  *
  SETTERS
  *
  */
  setHeight (w) {
    this._size.height = Math.max(w, this._size.minHeight)
    this._svg.border.attr('height', this._size.height)
    this._svg.background.attr('height', this._size.height - 2 * this._size.border)
    this._svg.text.attr('height', this._size.height - 2 * this._size.border)
    this.constraints.forEach(constraintId => window.app.data.getConstraints(constraintId).updatePosition(false))
    return this
  }

  setWidth (w) {
    this._size.width = Math.max(w, this._size.minWidth)
    this._svg.border.attr('width', this._size.width)
    this._svg.background.attr('width', this._size.width - 2 * this._size.border)
    this._svg.text.attr('width', this._size.width - 2 * this._size.border)
    this.constraints.forEach(constraintId => window.app.data.getConstraints(constraintId).updatePosition(false))
    return this
  }

  setSelected (bool = true) {
    this.selected = bool
    this._showSelectionBorder(bool)
    return this
  }

  /*
  *
  UTILITY
  *
  */
  addConstraint (constraintId) {
    const constraint = window.app.data.getConstraint(constraintId)
    if (constraint.targetId === null) {
      if (constraint.type.name === 'Absence') this.showAbsenceBox(true, constraint)
      if (constraint.type.name === 'Existence') this.showExistenceBox(true, constraint)
      if (constraint.type.name === 'Init') this.showInitBox(true, constraint)
      if (constraint.type.name === 'End') this.showEndBox(true, constraint)
    }

    this.constraints.add(constraintId)
    return this
  }

  removeConstraint (constraintId) {
    const constraint = window.app.data.getConstraint(constraintId)
    if (constraint.targetId === null) {
      if (constraint.type.name === 'Absence') this.showAbsenceBox(false)
      if (constraint.type.name === 'Existence') this.showExistenceBox(false)
      if (constraint.type.name === 'Init') this.showInitBox(false)
      if (constraint.type.name === 'End') this.showEndBox(false)
    }

    this.constraints.delete(constraintId)
    return this
  }

  constraintPropertiesUpdated (constraintId, key, value) {
    const constraint = window.app.data.getConstraint(constraintId)
    if (constraint.type.name === 'Existence' && key === 'min') {
      const min = value
      const max = constraint.getProperty('max')
      this._svg.existenceBox.text.text(`${min}...${max}`)
      this._svg.existenceBox.g.classed('existence-min-0', min == 0)
    }
    if (constraint.type.name === 'Existence' && key === 'max') {
      const min = constraint.getProperty('min')
      const max = value
      this._svg.existenceBox.text.text(`${min}...${value}`)
      this._svg.existenceBox.g.classed('existence-min-0', max == 0)
    }
  }

  _isPointInside (x, y) {
    return x >= this._svg.x + this._size.border && x <= this._svg.x + this._size.width - this._size.border &&
          y >= this._svg.y + this._size.border && y <= this._svg.y + this._size.height - this._size.border
  }

  _showDragBorder (bool = true) {
    if (bool) this._svg.dragBorder.style('display', null)
    else this._svg.dragBorder.style('display', 'none')
    return this
  }

  _showSelectionBorder (bool = true) {
    if (bool) this._svg.selectionBorder.style('display', null)
    else this._svg.selectionBorder.style('display', 'none')
    return this
  }

  partiallyHide (bool = true) {
    if (bool) this._svg.g.transition().style('opacity', 0.2)
    else this._svg.g.transition().style('opacity', 1)
    return this
  }

  showExistenceBox (bool, constraint) {
    this._svg.existenceBox.g.style('display', bool ? null : 'none')
    if (bool) {
      const min = constraint.getProperty('min', '0')
      const max = constraint.getProperty('max', 'N')
      this._svg.existenceBox.g.classed('existence-min-0', min == 0)
      this._svg.existenceBox.text.text(`${min}...${max}`)
    }
  }

  showAbsenceBox (bool) {
    this._svg.absenceBox.g.style('display', bool ? null : 'none')
  }

  showInitBox (bool) {
    this._svg.initBox.g.style('display', bool ? null : 'none')
  }

  showEndBox (bool) {
    this._svg.endBox.g.style('display', bool ? null : 'none')
  }

  setName (name) {
    this.name = name
    this._updateName()
    return this
  }

  _updateName () {
    this._svg.text.select('.name-text').text(this.name)
    /*
      prima di cambiare la dimensione devo sistemare le funzioni
      setWidth e setHeight, perchè non sistemano handles
      */
    /*
      let len = (this.name.length + 6) * this._size.text;
      let size = Math.max(this._size.minWidth, this._size.minHeight, len);
      this.setWidth(size);
      this.setHeight(size);
      */
    this.afterUpdate()
    return this
  }

  afterUpdate () {
    window.app.data.saveModelToCache()
  }

  toActivityModel () {
    const model = new ActivityModel()

    model.activityId(this.id)
      .activityName(this.name)
      .x(this._svg.x)
      .y(this._svg.y)
      .width(this._size.width)
      .height(this._size.height)

    return model
  }
}
