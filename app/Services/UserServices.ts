import { injectable, inject } from 'tsyringe'
import { DateTime } from 'luxon'
import crypto from 'crypto'

import { IUser } from 'App/Interfaces/IUser'
import User from 'App/Models/User'
import { PaginateContractType } from 'App/Shared/Interfaces/BaseInterface'

import NotFoundException from 'App/Shared/Exceptions/NotFoundException'
import BadRequestException from 'App/Shared/Exceptions/BadRequestException'

import DTOs = IUser.DTOs

@injectable()
export default class UserServices {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUser.Repository
  ) {}

  public async list({
    page = 1,
    perPage = 10,
    search,
  }: DTOs.List): Promise<PaginateContractType<typeof User>> {
    return this.usersRepository.listWithPagination({
      page,
      perPage,
      scopes: (scopes) => {
        scopes.searchQueryScope(search)
      },
    })
  }

  public async get(id: string): Promise<User> {
    const user = await this.usersRepository.findBy(
      'id', id,
      {
        scopes: (scopes) => {
          scopes.followersCount()
          scopes.followedCount()
        },
      }
    )
    if (!user) throw new NotFoundException('User not found or not available.')

    return user
  }

  public async store(data: DTOs.Store): Promise<User> {
    const { ...userDto } = data

    const user = await this.usersRepository.store(userDto)

    return user.refresh()
  }

  public async edit(id: number, data: DTOs.Edit): Promise<User> {
    const user = await this.usersRepository.findBy('id', id)
    if (!user) throw new NotFoundException('User not found or not available.')

    const { ...userDto } = data

    user.merge(userDto)
    await this.usersRepository.save(user)

    return user.refresh()
  }

  public async delete(id: string): Promise<void> {
    const user = await this.usersRepository.findBy('id', id)
    if (!user) throw new NotFoundException('User not found or not available.')

    user.merge({
      email: `deleted:${user.email}:${crypto.randomBytes(6).toString('hex')}`,
      username: `deleted:${user.username}:${crypto.randomBytes(6).toString('hex')}`,
      is_deleted: true,
      deleted_at: DateTime.now(),
    })
    await this.usersRepository.save(user)
  }

  public async updateNotificationToken(id: number, token: string | null): Promise<void> {
    const user = await this.usersRepository.findBy('id', id);
    if (!user) throw new NotFoundException('User not found or not available.')

      if(token === null && user.notification_token == null){
        throw new BadRequestException('There is no token to be deleted.')
      }

    user.notification_token = token
      
    user.save();

    await this.usersRepository.save(user)

  }
}
