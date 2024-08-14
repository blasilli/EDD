/* eslint-disable camelcase */

export class ModelStringParsingError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ModelStringParsingError'
    console.error(`[${this.name}] ${message}`)
  }
}
