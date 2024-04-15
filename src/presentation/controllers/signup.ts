import { AddAccount } from '../../domain/usecases/add-account'
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
  // Classe de producao
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    // Ingetamos 2 dependecias (EmailValidator e AddAccount)
    this.emailValidator = emailValidator
    this.addAccount = addAccount
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

      // Pegando os dados do http request
      const { name, email, password, passwordConfirmation } = httpRequest.body
      // Validacao do email
      const isValid = this.emailValidator.isValid(email)
      // const isValid = this.emailValidator.isValid('ccadcuarlos@gmail.com') false email to be checked on test
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      // Verificar se password e password confirmation forem iguais
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      this.addAccount.add({
        name,
        email,
        password,
      })

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
