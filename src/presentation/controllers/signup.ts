export class SignUpController {
  handle(httpRequest: unknown) {
    return {
      statusCode: 400,
      body: new Error('Missing a param: name'),
    }
  }
}
