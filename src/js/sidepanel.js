import * as d3 from 'd3'
import constraintTypes from './constraintTypes'
import '../styles/sidepanel.scss'

export default class Sidepanel {
  constructor () {
    this.globalMenu = d3.select('#sidepanel .global-menu').style('display', null)
    this.activityMenu = d3.select('#sidepanel .activity-menu').style('display', 'none')
    this.constraintMenu = d3.select('#sidepanel .constraint-menu').style('display', 'none')
    this.counterActivities = d3.select('#sidepanel #num-activities')
    this.counterConstraints = d3.select('#sidepanel #num-constraints')
    this.updateGlobalMenu()
  }

  removeAll () {
    this.globalMenu.style('display', 'none')
    this.activityMenu.style('display', 'none')
    this.constraintMenu.style('display', 'none')
  }

  showGlobalMenu () {
    this.removeAll()
    this.updateGlobalMenu()
    this.globalMenu.style('display', null)
  }

  showActivityMenu (activity) {
    this.removeAll()
    this.activityMenu.select('.activity-id').text(activity.id)
    this.activityMenu.select('.delete-activity')
      .on('click', () => {
        window.app.data.deleteActivity(activity.id)
        this.showGlobalMenu()
      })
    this.activityMenu.select('.activity-name')
      // .property('pattern', '[A-Za-z0-9]+')
      .property('value', activity.name)
      .on('keyup', function () {
        const name = d3.select(this).property('value')
        activity.setName(name)
      })

    const absenceConstraintArr = [...activity.getConstraints().values()].map(cId => window.app.data.getConstraint(cId)).filter(c => c.type.name === 'Absence')
    let absenceConstraint = absenceConstraintArr.length > 0 ? absenceConstraintArr[0] : null

    const existenceConstraintArr = [...activity.getConstraints().values()].map(cId => window.app.data.getConstraint(cId)).filter(c => c.type.name === 'Existence')
    let existenceConstraint = existenceConstraintArr.length > 0 ? existenceConstraintArr[0] : null

    const initConstraintArr = [...activity.getConstraints().values()].map(cId => window.app.data.getConstraint(cId)).filter(c => c.type.name === 'Init')
    let initConstraint = initConstraintArr.length > 0 ? initConstraintArr[0] : null

    const endConstraintArr = [...activity.getConstraints().values()].map(cId => window.app.data.getConstraint(cId)).filter(c => c.type.name === 'End')
    let endConstraint = endConstraintArr.length > 0 ? endConstraintArr[0] : null

    this.activityMenu.select('#initCheckbox')
      .property('checked', initConstraint !== null)
      .on('change', (event) => {
        const selected = d3.select(event.srcElement).property('checked')
        if (selected) {
          initConstraint = window.app.data.createConstraint(null, activity.id, null, 'Init')
        } else {
          window.app.data.deleteConstraint(initConstraint.id)
        }
      })

    this.activityMenu.select('#endCheckbox')
      .property('checked', endConstraint !== null)
      .on('change', (event) => {
        const selected = d3.select(event.srcElement).property('checked')
        if (selected) {
          endConstraint = window.app.data.createConstraint(null, activity.id, null, 'End')
        } else {
          window.app.data.deleteConstraint(endConstraint.id)
        }
      })

    this.activityMenu.select('#absenceCheckbox')
      .property('checked', absenceConstraint !== null)
      .on('change', (event) => {
        const selected = d3.select(event.srcElement).property('checked')
        if (selected) {
          absenceConstraint = window.app.data.createConstraint(null, activity.id, null, 'Absence')
        } else {
          window.app.data.deleteConstraint(absenceConstraint.id)
        }
      })
    this.activityMenu.select('#existenceCheckbox')
      .property('checked', existenceConstraint !== null)
      .on('change', (event) => {
        const selected = d3.select(event.srcElement).property('checked')
        if (selected) {
          this.activityMenu.select('#existenceMinValue').property('disabled', false)
          this.activityMenu.select('#existenceMaxValue').property('disabled', false)
          existenceConstraint = window.app.data.createConstraint(null, activity.id, null, 'Existence')
        } else {
          this.activityMenu.select('#existenceMinValue').property('disabled', true)
          this.activityMenu.select('#existenceMaxValue').property('disabled', true)
          window.app.data.deleteConstraint(existenceConstraint.id)
        }
        // if (selected) this.activityMenu.select('#absenceCheckbox').property('checked', false)
      })
    this.activityMenu.select('#existenceMinValue')
      .property('disabled', existenceConstraint === null)
      .property('value', existenceConstraint !== null ? existenceConstraint.getProperty('min') : '')
      .on('keyup', function () {
        const minValue = d3.select(this).property('value')
        existenceConstraint.setProperty('min', minValue)
      })
    this.activityMenu.select('#existenceMaxValue')
      .property('disabled', existenceConstraint === null)
      .property('value', existenceConstraint !== null ? existenceConstraint.getProperty('max') : '')
      .on('keyup', function () {
        const maxValue = d3.select(this).property('value')
        existenceConstraint.setProperty('max', maxValue)
      })

    this.activityMenu.style('display', null)
  }

  showConstraintMenu (constraint) {
    this.removeAll()
    this.constraintMenu.select('.constraint-id').text(constraint.id)
    this.constraintMenu.select('.delete-constraint')
      .on('click', () => {
        window.app.data.deleteConstraint(constraint.id)
        this.showGlobalMenu()
      })
    this.constraintMenu.select('.params .p1 .param-value').text(constraint.getSourceActivity().name)
    this.constraintMenu.select('.params .p2 .param-value').text(constraint.getTargetActivity().name)
    this.constraintMenu.select('.params .swap-btn button')
      .on('click', () => {
        window.app.data.swapConstraintActivities(constraint.id)
      })

    this.constraintMenu.select('.body').selectAll('*').remove()
    Object.keys(constraintTypes).forEach(groupName => {
      if (groupName === 'Activity Existence') return
      if (groupName === 'Activity Role') return
      const div = this.constraintMenu.select('.body')
        .append('div').attr('class', 'row')
      div.append('div').attr('class', 'col-12 constraint-group-name').text(groupName)
      div.selectAll('.constraint-type')
        .data(Object.values(constraintTypes[groupName]).map(C => new C()))
        .enter()
        .append('div').attr('class', 'col-12 constraint-type')
        .append('input').attr('type', 'radio').attr('name', 'constraint-type')
        .attr('checked', d => constraint.name === d.name ? true : null)
        .property('value', d => d.xmlName)
        .select(function () { return this.parentNode })
        .append('span').text(d => d.toString())
    })
    this.constraintMenu.select('.body').selectAll('input')
      .on('change', (e, d) => constraint.setType(d))

    this.constraintMenu.style('display', null)
  }

  updateGlobalMenu () {
    const activities = window.app.data.getActivities()
    this.counterActivities.text((activities.length === 0) ? '' : activities.length)
    this.globalMenu.select('#activities-tab-pane').selectAll('*').remove()
    const activitiesTable = this.globalMenu.select('#activities-tab-pane').append('table').attr('class', 'table table-sm')
    activitiesTable.append('thead').append('tr')
      .selectAll('th')
      .data(['Activity Id', 'Activity Name', 'Edit'])
      .enter()
      .append('th')
      .attr('scope', 'col')
      .text(d => d)
    activitiesTable.append('tbody')
      .selectAll('tr')
      .data(activities)
      .enter()
      .append('tr')
      .each(function (d) {
        const tr = d3.select(this)
          .on('mouseover', () => d.highlight(true))
          .on('mouseout', () => d.highlight(false))
          // .on('click', () => window.app.data.selectElement(d.id))
        tr.append('td').attr('scope', 'row').text(d.id)
        tr.append('td').text(d.name)
        tr.append('td').attr('class', 'edit').append('i').attr('class', 'fas fa-pen').on('click', () => window.app.data.selectElement(d.id))
      })

    const constraints = window.app.data.getConstraints()
    this.counterConstraints.text((constraints.length === 0) ? '' : constraints.length)
    this.globalMenu.select('#constraints-tab-pane').selectAll('*').remove()
    const constraintsTable = this.globalMenu.select('#constraints-tab-pane').append('table').attr('class', 'table table-sm')
    constraintsTable.append('thead').append('tr')
      .selectAll('th')
      .data(['Id', 'Type', 'Param1', 'Param2', 'Edit'])
      .enter()
      .append('th')
      .attr('scope', 'col')
      .text(d => d)
    constraintsTable.append('tbody')
      .selectAll('tr')
      .data(constraints)
      .enter()
      .append('tr')
      .each(function (d) {
        const tr = d3.select(this)
          .on('mouseover', () => d.highlight(true))
          .on('mouseout', () => d.highlight(false))
          // .on('click', () => window.app.data.selectElement(d.id))
        tr.append('td').attr('scope', 'row').text(d.id)
        tr.append('td').text(d.type.name)
        tr.append('td').text(d.getSourceActivity().name)
        tr.append('td').text(d.getTargetActivity() === null ? '---' : d.getTargetActivity().name)

        if (d.getTargetActivity() === null) {
          tr.append('td').text('')
        } else {
          tr.append('td').attr('class', 'edit').append('i').attr('class', 'fas fa-pen').on('click', () => window.app.data.selectElement(d.id))
        }
      })
  }
}
