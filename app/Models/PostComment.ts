import {
  belongsTo,
  BelongsTo,
  column,
  
  ModelQueryBuilderContract,
  scope,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Post from 'App/Models/Post'
import User from 'App/Models/User'
import BaseModel from 'App/Shared/Models/BaseModel'

export default class PostComment extends BaseModel {
  public static table = 'post_comments'

  /**
   * ------------------------------------------------------
   * Columns
   * ------------------------------------------------------
   * - column typing struct
   */
  @column({ isPrimary: true })
  public id: number

  @column()
  public message: string

  @column()
  public user_id: number

  @column()
  public post_id: number

  @column()
  public hub_event_id: number | null

  @column({ serializeAs: null })
  public is_deleted: boolean

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @column.dateTime({ serializeAs: null })
  
  public deleted_at: DateTime

  /**
   * ------------------------------------------------------
   * Relationships
   * ------------------------------------------------------
   * - define post comment model relationships
   */
  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Post, { foreignKey: 'post_id' })
  public post: BelongsTo<typeof Post>

  /**
   * ------------------------------------------------------
   * Hooks
   * ------------------------------------------------------
   */

  /**
   * ------------------------------------------------------
   * Query Scopes
   * ------------------------------------------------------
   */
  public static loadUser = scope((query: ModelQueryBuilderContract<typeof PostComment>) => {
    query.preload('user')
  })
  public static loadPost = scope((query: ModelQueryBuilderContract<typeof PostComment>) => {
    query.preload('post')
  })


  /**
   * ------------------------------------------------------
   * Misc
   * ------------------------------------------------------
   */
  public serializeExtras = true
}
