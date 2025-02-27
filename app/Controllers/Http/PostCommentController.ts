import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { container } from 'tsyringe'

import {
  CreatePostCommentService,
  DeletePostCommentService,
  IndexPostCommentService,
  ShowPostCommentService,
  UpdatePostCommentService,
} from 'App/Services/PostComment'
import { PostCommentValidators } from 'App/Validators/PostCommentValidators'

/** --- services --- */

export default class PostCommentController {
  public async store({ request, response, auth }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostCommentValidators.Store)
    const currentUser = auth.user

    const createService = container.resolve(CreatePostCommentService)

    if (typeof currentUser?.id !== 'number') {
      throw new Error('User ID is not a number')
    }
    const postComment = await createService.run({ ...data, user_id: currentUser.id })

    return response.json(postComment)
  }

  public async update({ request, response, params }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostCommentValidators.Update)
    const { commentId } = params
    const currentUser = request.input('user')

    const updateService = container.resolve(UpdatePostCommentService)
    const postComment = await updateService.run({ ...data }, commentId, currentUser.id)

    return response.json(postComment)
  }

  public async show({ request, response, params }: HttpContextContract): Promise<void> {
    const { commentId } = params
    const currentUser = request.input('user')

    const showService = container.resolve(ShowPostCommentService)
    const postComment = await showService.run(commentId, currentUser.id)

    return response.json(postComment)
  }

  public async index({ request, response }: HttpContextContract): Promise<void> {

    const page = request.input('page', 1)
    const perPage = request.input('per_page', 10)
    const postId = request.input('post_id', null)

    const indexService = container.resolve(IndexPostCommentService)
    const postComment = await indexService.run(page, postId, perPage)

    return response.json(postComment)
  }

  public async destroy({ response, params,  auth }: HttpContextContract): Promise<void> {
    const { commentId } = params

    const currentUser = auth.user

    const deleteService = container.resolve(DeletePostCommentService)
    if (typeof currentUser?.id !== 'number') {
      throw new Error('User ID is not a number')
    }
    await deleteService.run(commentId, currentUser.id)

    return response.json({ message: 'Comment deleted.' })
  }
}
