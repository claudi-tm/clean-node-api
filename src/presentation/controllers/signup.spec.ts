import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('should Should return 400 if no name is provided', () => {
    const sut = new SignUpController()
    console.log(sut)
    const httpRequest = {
      body: {
        email: 'any_email@yahoo.com',
        password: 'password',
        passwordConfirmation: 'password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })
  test('should Should return 400 if no name is provided', () => {
    const sut = new SignUpController()
    console.log(sut)
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'password',
        passwordConfirmation: 'password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: email'))
  })
})
