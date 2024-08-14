/* eslint-disable camelcase */

export class RUMModelStringParsingError extends Error {
  constructor (message, data = undefined) {
    super(message)
    this.name = 'RUMModelStringParsingError'
    console.error(`[${this.name}] ${message}`, data)
  }
}
