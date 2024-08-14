import * as d3 from 'd3'
import '../styles/controlbar.scss'

export default class ControlBar {
  /*
  */
  constructor (app) {
    this.app = app
    this.div = d3.select('#controlbar')
    this.buttons = {}

    this.buttons.newProject = this.div.select('#btn-new-project')
      .on('click', () => {
        if (window.confirm('Do you want to create a new project? \nThe current project will be deleted.')) {
          this.app.init(null)
        }
      })

    this.buttons.loadFile = this.div.select('#btn-load-file')
      .on('click', () => { this.app.import.openPopup() })

    this.buttons.saveFile = this.div.select('#btn-save-file')
      .on('click', () => { this.app.export.exportXmlFile() })
  }
}
