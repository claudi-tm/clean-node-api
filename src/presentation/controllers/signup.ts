import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '../errors/index'

import { badRequest } from '../helpers/http-helper'
import {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
} from '../protocols/index'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ]
      // Validacao de campos obrigatorios
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      // Validacao do email
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      // const isValid = this.emailValidator.isValid('ccadcuarlos@gmail.com') false email to be checked on test
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      // Verificar se password e password confirmation forem iguais
      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      return {
        statusCode: 200,
        body: { message: `${isValid}` },
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError(),
      }
    }
  }
}
