import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '../errors/index'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { HttpRequest, HttpResponse } from '../protocols/http'
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

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      // const isValid = this.emailValidator.isValid('ccadcuarlos@gmail.com') false email to be checked on test

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
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
