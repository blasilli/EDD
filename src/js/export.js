/* global Blob */

export default class Export {
  exportToEDJFile () {
    const model = window.app.data.toModel()
    const str = model.toString()
    const filename = `${model.name()}.edj`
    this._exportFile(filename, str)
  }

  exportToDeclFile () {
    const model = window.app.data.toModel()
    const str = model.toDecl()
    const filename = `${model.name()}.decl`
    this._exportFile(filename, str)
  }

  exportToRumFile () {
    const model = window.app.data.toRum()
    const str = model.toRum()
    const filename = `${model.name()}.rum`
    this._exportFile(filename, str)
  }

  _exportFile (filename, str) {
    const blob = new Blob([str], { type: 'text/plain' })
    const downloadLink = document.createElement('a')
    downloadLink.download = filename
    downloadLink.innerHTML = 'Download File'
    downloadLink.href = window.URL.createObjectURL(blob)
    downloadLink.onclick = (event) => document.body.removeChild(event.target)
    downloadLink.style.display = 'none'
    document.body.appendChild(downloadLink)
    downloadLink.click()
  }
}
