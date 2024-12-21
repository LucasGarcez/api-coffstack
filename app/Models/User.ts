import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  computed,
  scope,
  beforeCreate,
  hasMany,
  HasMany,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

import BaseModel from 'App/Shared/Models/BaseModel'
import Message from 'App/Models/Message'
import Follow from 'App/Models/Follow'

export default class User extends BaseModel {
  public static table = 'users'

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * - column typing struct
   */
  @column({ isPrimary: true })
  public id: number

  @computed()
  public get full_name() {
    return `${this.firstName} ${this.lastName}`
  }

  @column({ columnName: 'first_name' })
  public firstName: string

  @column({ columnName: 'last_name' })
  public lastName: string

  @column()
  public username: string

  @column({ columnName: 'profile_url' })
  public profileURL: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public temp_password: string | null

  @column()
  public temp_token?: string | null

  @column({ columnName: 'remember_me_token' })
  public rememberMeToken: string | null

  @column()
  public is_online: boolean

  @column({ serializeAs: null })
  public is_blocked: boolean

  @column({ serializeAs: null })
  public is_deleted: boolean

  @column({ serializeAs: null })
  public notification_token: string | null

  @column()
  // @no-swagger
  public temp_token_created_at?: Date | null

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updated_at: DateTime

  @column.dateTime({ autoUpdate: true, serializeAs: null })
  public deleted_at: DateTime

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) user.password = await Hash.make(user.password)
  }

  @beforeCreate()
  public static async attachUserName(user: User): Promise<void> {
    if (!user.username) {
      user.username = user.email.split('@')[0]
      for (let i = 0; ; i++) {
        if (!(await User.query().where('username', user.username).first()))
          user.username = `${user.username}${i}`
        else break
      }
    }
  }

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   * - define User model relationships
   */

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>

  @hasMany(() => Follow, { foreignKey: 'follower_user_id' })
  public follower: HasMany<typeof Follow>

  @hasMany(() => Follow, { foreignKey: 'followed_user_id' })
  public followed: HasMany<typeof Follow>

  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */

  /**
   * Get all messages received by the user
   */
  public async receivedMessages(): Promise<Message[]> {
    return Message.query().where('recipient_id', this.id)
  }

  public static searchQueryScope = scope((query, search) => {
    const fields = ['first_name', 'last_name', 'username', 'email']
    let sql = ''

    fields.forEach(
      (field, i) => (sql = `${sql} ${i !== 0 ? ' or ' : ' '} ${field} ilike '%${search}%'`)
    )

    return query.whereRaw(`(${sql})`)
  })

  public static followersCount = scope((query: ModelQueryBuilderContract<typeof User>) =>
    query.withCount('follower', (builder) =>
      builder.as('following_count')
    )
  )

  public static followedCount = scope((query: ModelQueryBuilderContract<typeof User>) =>
    query.withCount('followed', (builder) =>
      builder.as('followers_count')
    )
  )

  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   */
  public serializeExtras = true
}
