export class ServerError extends Error {
  constructor() {
    super('Internal Server Error a')
    this.name = 'Server Error'
  }
}
