import { AccountModel } from '../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { ServerError } from '../errors/server-error'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      throw new Error()
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'id',
        name: 'name',
        email: 'email',
        password: 'password',
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

describe('SignUp Controller', () => {
  describe('Test inputs', () => {
    test('Should return 400 if no name is provided', () => {
      const { sut } = makeSut()
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

    test('Should return 400 if no email is provided', () => {
      const { sut } = makeSut()
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

    test('Should return 400 if no password is provided', () => {
      const { sut } = makeSut()
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

    test('Should return 400 if no passwordConfirmation is provided', () => {
      const { sut } = makeSut()
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
  })

  describe('Email Validation', () => {
    test('Should return 400 if an invalid email is provided', () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@gmail.com',
          password: 'password',
          passwordConfirmation: 'passwordConfirmation',
        },
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Should call EmailValidator with correct email', () => {
      const { sut, emailValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@gmail.com',
          password: 'password',
          passwordConfirmation: 'passwordConfirmation',
        },
      }
      sut.handle(httpRequest)
      expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
    })

    // test('Should return 500 if email validador throws an exception', () => {
    //   const emailValidatorStub = makeEmailValidatorWithError()
    //   const { sut } = makeSut()
    //   // const sut = new SignUpController(emailValidatorStub)
    //   const httpRequest = {
    //     body: {
    //       name: 'any_name',
    //       email: 'any_email@gmail.com',
    //       password: 'password',
    //       passwordConfirmation: 'passwordConfirmation',
    //     },
    //   }
    //   const httpResponse = sut.handle(httpRequest)
    //   expect(httpResponse.statusCode).toBe(500)
    //   expect(httpResponse.body).toEqual(new ServerError())
    // })

    test('Should return 500 if email validator throws an exception using mocking', () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })
      const httpRequest = {
        body: {
          name: 'any_name',
          email: 'any_email@gmail.com',
          password: 'password',
          passwordConfirmation: 'passwordConfirmation',
        },
      }
      const httpResponse = sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body).toEqual(new ServerError())
    })
  })

  test('should return 400 if password confirmation fails ...', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'password',
        passwordConfirmation: 'passwordConfirmation',
      },
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    )
  })

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add') // peaga o valor de retorno do input
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'password',
        passwordConfirmation: 'password',
      },
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      // pega o valor enviado pelo request com o addSpy e verifica se ele é chamado como o objecto que abaixo
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'password',
    })
  })
})
