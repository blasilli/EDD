import NavBar from './navbar'
import Data from './data'
import Canvas from './canvas'
import Sidepanel from './sidepanel'
import Import from './import'
import Export from './export'

export default class App {
  constructor () {
    this.data = null
    this.canvas = null
    this.controlBar = null
    this.sidepanel = null
    this.import = null
    this.export = null
  }

  init (model) {
    this.data = new Data()
    this.canvas = new Canvas()
    this.navbar = new NavBar()
    this.sidepanel = new Sidepanel()
    this.import = new Import()
    this.export = new Export()

    // if model == null -> is setted to start a new project
    // if model == undefined -> load from cache

    if (model === undefined) model = this.data.loadModelFromCache()
    if (model !== undefined && model !== null) {
      console.log(model)

      this.data.modelId = model.id()
      this.data.modelName = model.name()

      model.activities().forEach(a => {
        const id = a.activityId()
        const x = a.x()
        const y = a.y()
        const name = a.activityName()
        this.data.createActivity(id, { x, y }).setName(name)
      })

      model.constraints().forEach(c => {
        const id = c.constraintId()
        const sourceId = c.sourceActivityId()
        const targetId = c.targetActivityId()
        const name = c.constraintName()
        const props = c.props()
        // console.log(id, sourceId, targetId, name, props)
        this.data.createConstraint(id, sourceId, targetId, name, props)
      })
    }
  }
}
