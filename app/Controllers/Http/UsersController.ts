import 'App/Services/container'
import { container } from 'tsyringe'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { EditUserSchema, UpdateNotificationTokenSchema } from 'App/Validators/UserValidator'
import UserServices from 'App/Services/UserServices'

export default class UsersController {

  /**
   * @list
   * @summary List users
   * @tag Users
   * @paramQuery page - Page number - @example(1) @type(integer) @required
   * @paramQuery per_page - Number of items per page - @example(10) @type(integer)
   * @paramQuery search - Search - @example(tsilva@coffstack.com) @type(string)
   */
  public async list({ request, response }: HttpContextContract): Promise<void> {
    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)
    const search = request.input('search', '')
    const userServices = container.resolve(UserServices)
    const users = await userServices.list({ page, perPage, search })
    return response.json(users)
  }

  /**
   * @get
   * @summary Show user
   * @tag Users
   * @paramPath id - User id - @example(1) @type(integer)
   */
  public async get({ params, response }: HttpContextContract): Promise<void> {
    const { id: userId } = params
    const userServices = container.resolve(UserServices)
    const user = await userServices.get(userId)
    return response.json(user)
  }

  /**
   * @edit
   * @summary Edit user
   * @tag Users
   * @requestBody {"firstName": "string", "lastName": "string", "username": "string"}
   */
  public async edit({ request, auth, response }: HttpContextContract): Promise<void> {
    const userId = auth.user?.id!
    const userDto = await request.validate({ schema: EditUserSchema })
    const userServices = container.resolve(UserServices)
    const user = await userServices.edit(userId, userDto)
    return response.json(user)
  }

  /**
   * @delete
   * @summary Delete user
   * @tag Users
   * @paramPath id - User id - @example(1) @type(integer)
   */
  public async delete({ params, response }: HttpContextContract): Promise<void> {
    const { id: userId } = params
    const userServices = container.resolve(UserServices)
    await userServices.delete(userId)
    return response.json({ message: 'User deleted successfully.' })
  }


    /**
   * @edit
   * @summary Update Notification Token
   * @tag Users
   * @requestBody {"token": "string"}
   */
    public async updateNotificationToken({ request, auth, response }: HttpContextContract): Promise<void> {
      const userId = auth.user?.id!
      const {token} = await request.validate({ schema: UpdateNotificationTokenSchema })
      
      const userServices = container.resolve(UserServices)

      await userServices.updateNotificationToken(userId, token)
      return response.json({ message: 'Notification token updated successfully.' })
    }
    /**
   * @delete
   * @summary Delete Notification Token
   * @tag Users
   */
    public async deleteNotificationToken({  auth, response }: HttpContextContract): Promise<void> {
      const userId = auth.user?.id!      
      const userServices = container.resolve(UserServices)

      await userServices.updateNotificationToken(userId, null)
      return response.json({ message: 'Notification token deleted successfully.' })
    }
}
