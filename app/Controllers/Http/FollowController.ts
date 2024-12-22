import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { container } from 'tsyringe'
import Firebase from '@ioc:App/Firebase';


import FollowServices from 'App/Services/FollowServices'
import { FollowValidators } from 'App/Validators/FollowValidators'
import UserServices from 'App/Services/UserServices';

export default class FollowController {

  /**
   * @listFollowing
   * @summary List followers
   * @tag Follow
   * @paramQuery page - Page number - @example(1) @type(integer) @required
   * @paramQuery per_page - Number of items per page - @example(10) @type(integer)
   */
  public async listFollowing({ request, response, auth }: HttpContextContract): Promise<void> {
    const userId = auth.user?.id!

    const { page, perPage } = request.qs()
    const listFollowerService = container.resolve(FollowServices)
    const followers = await listFollowerService.listFollowing({ page, perPage, userId })
    return response.json(followers)
  }

  /**
   * @listFollower
   * @summary List followed
   * @tag Follow
   * @paramQuery page - Page number - @example(1) @type(integer) @required
   * @paramQuery per_page - Number of items per page - @example(10) @type(integer)
   */
  public async listFollower({ request, response, auth }: HttpContextContract): Promise<void> {
    const userId = auth.user?.id!

    const { page, perPage } = request.qs()
    const listFollowedService = container.resolve(FollowServices)
    const followed = await listFollowedService.listFollower({ page, perPage, userId })
    return response.json(followed)
  }


   /**
   * @isFollowing
   * @summary Check if user is followed
   * @tag Follow
   * @paramPath id - User id - @example(1) @type(integer)
   */
   public async isFollowing({ response, auth, params }: HttpContextContract): Promise<void> {
    const userId = auth.user?.id!

    const { id: followed_user_id } = params

    const createFollowService = container.resolve(FollowServices)

    const isFollowing = await createFollowService.isFollowing({ follower_user_id: userId, followed_user_id });

    return response.json({isFollowing})
    
  }



  /**
   * @storeFollower
   * @summary Create Follower
   * @tag Follow
   * @paramQuery followed_user_id - Followed user id - @example(2) @type(integer) @required
   */
  public async storeFollower({ request, response, auth }: HttpContextContract): Promise<void> {
    const userId = auth.user?.id!

    const { followed_user_id } = await request.validate(FollowValidators.Create)
    const followService = container.resolve(FollowServices)

    const isFollowing = await followService.isFollowing({ follower_user_id: userId, followed_user_id });

    if (isFollowing) {
      return response.status(400).json({ message: 'You already follow this user' })
    }

    const follow = await followService.store({ follower_user_id: userId, followed_user_id })

    // notification 
    
    const userServices = container.resolve(UserServices)
    const followedUser = await userServices.get(followed_user_id.toString());
    if(followedUser.notification_token) {
      const user = await userServices.get(userId.toString());

      // https://rnfirebase.io/messaging/server-integration#send-messages-with-image
      Firebase.messaging().send({
        token: followedUser.notification_token,
        notification: {
          title: 'Nubble',
          body: `${user.full_name} começou a te seguir`
        },
        data: {
          navigate: JSON.stringify({ screen: 'ProfileScreen', params: {userId: userId}})
        },
        apns: {
          payload: {
            aps: {
              'mutable-content': 1
            }
          },
          fcmOptions: {
            imageUrl: user.profileURL
          }
        },
        android: {
          notification: {
            imageUrl: user.profileURL
          }
        }
      })
    }
    
    return response.json(follow)
  }

  /**
   * @deleteFollower
   * @summary Delete Follower
   * @tag Follow
   * @paramPath id - Follow id - @example(1) @type(integer) @required
   */
  public async deleteFollower({ params, response, auth }: HttpContextContract): Promise<void> {
    const { id } = params
    const userId = auth.user?.id!

    const deleteFollowService = container.resolve(FollowServices)

    await deleteFollowService.delete({ id, follower_user_id: userId })
    return response.json({ message: 'Follow deleted' })
  }

}
