import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

import { IPostComment } from '../Interfaces/IPostComment'
import PostComment from '../Models/PostComment'

export default class PostCommentsRepository implements IPostComment.Repository {
  public async create(timelineDTO: IPostComment.DTO.Store): Promise<PostComment> {
    return PostComment.create(timelineDTO)
  }

  public async index(
    page: number,
    postId: number | null,
    perPage: number
  ): Promise<ModelPaginatorContract<PostComment>> {
    return PostComment.query()
      .withScopes((scopes) => {
        scopes.loadUser()
      })
      .withScopes((scopes) => {
        scopes.loadPost()
      })
      .where({
        post_id: postId,
      })
      .orderBy('created_at', 'desc')
      .paginate(page, perPage)
  }

  public async show(postCommentId: number, _userId: number): Promise<PostComment | null> {
    return PostComment.query()
      .withScopes((scopes) => {
        scopes.loadUser()
      })
      .where('id', postCommentId)
      .first()
  }

  public async store(data: IPostComment.DTO.Store): Promise<PostComment> {
    return PostComment.create(data)
  }

  public async update(timeline_category: PostComment): Promise<PostComment> {
    return timeline_category.save()
  }

  /* ---------------------------- HELPERS ---------------------------- */

  public async findBy(findKey: string, findValue: any): Promise<PostComment | null> {
    return PostComment.findBy(findKey, findValue)
  }
  public async findByEager(findKey: string, findValue: any): Promise<PostComment | null> {
    return PostComment.query()
    .withScopes((scopes) => {
      scopes.loadUser()
    })
    .withScopes((scopes) => {
      scopes.loadPost()
    })
    .where(findKey, findValue)
    .first()
  }

  public async findOrCreate(
    searchPayload: IPostComment.DTO.Update,
    createPayload: IPostComment.DTO.Store
  ): Promise<PostComment | null> {
    return PostComment.firstOrCreate(searchPayload, createPayload)
  }

  public async getCommentCountBetweenDate(
    startDate: Date | string,
    endDate: Date | string
  ): Promise<number> {
    const commentCount = await PostComment.query()
      .whereBetween('created_at', [startDate, endDate])
      .count('*')

    return Number(commentCount[0].$extras.count)
  }

  public async getUserCountByPost(postId: number): Promise<number> {
    const reactionCount = await PostComment.query()
      .where({
        post_id: postId,
      })
      .countDistinct('user_id')

    return Number(reactionCount[0].$extras.count)
  }

  public async getLastByPost(postId: number): Promise<PostComment | null> {
    return PostComment.query().where({ post_id: postId }).orderBy('created_at', 'desc').first()
  }

  /* ---- SETTERS ---- */

  /* ---- GETTERS ---- */

  /* ---- CHECKERS  ----*/
}
