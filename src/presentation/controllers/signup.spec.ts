import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('should Should return 400 if no name is provided', () => {
    const sut = new SignUpController()
    console.log(sut)
    const httpRequest = {
      name: 'any_name',
      email: 'any_email@yahoo.com',
      password: 'password',
      passwordConfirmation: 'password',
    }
    const httpResponse = sut.handle(httpRequest)
    // haha
    // const sut = new SignUpController()
    // const httpRequest = {
    //   body: {
    //     name: 'any_name',
    //     email: 'any_email@yahoo.com',
    //     password: 'password',
    //     passwordConfirmation: 'password',
    //   },
    // }
    // const httpResponse = sut.handle(httpRequest)
    // expect(httpResponse.statusCode).toBe(400)
  })
})
