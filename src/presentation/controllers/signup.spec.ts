import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { SignUpController } from './signup'

const makeSut = (): SignUpController => {
  class EmailValidatorStub {
    isValid(email: string): boolean {
      return true
    }
  }
  return new SignUpController()
  // const emailValidatorStub = new EmailValidatorStub)
  // return new SignUpController(emailValidatorStub)
}

describe('SignUp Controller', () => {
  test('should Should return 400 if no name is provided', () => {
    const sut = makeSut()
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
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should Should return 400 if no email is provided', () => {
    const sut = makeSut()
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
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should Should return 400 if no password is provided', () => {
    const sut = makeSut()
    console.log(sut)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        passwordConfirmation: 'password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should Should return 400 if no passwordConfirmation is provided', () => {
    const sut = makeSut()
    console.log(sut)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'password',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    )
  })

  // test('should Should return 400 if an invalid email is provided', () => {
  //   const sut = makeSut()
  //   console.log(sut)
  //   const httpRequest = {
  //     body: {
  //       name: 'any_name',
  //       email: 'any_email@gmail.com',
  //       password: 'password',
  //       passwordConfirmation: 'passwordConfirmation',
  //     },
  //   }
  //   const httpResponse = sut.handle(httpRequest)
  //   expect(httpResponse.statusCode).toBe(400)
  //   expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  // })
})
