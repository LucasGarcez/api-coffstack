import Route from '@ioc:Adonis/Core/Route'

/** Private  Routes */

/**
 * Users - Routes
 */
Route.group(() => {
  Route.get('/', 'UsersController.list')
  Route.get('/:id', 'UsersController.get').as('users.get')
  Route.put('/', 'UsersController.edit').as('users.edit')
  Route.post('/notification-token', 'UsersController.updateNotificationToken').as('users.updateNotificationToken')
  Route.delete('/notification-token', 'UsersController.deleteNotificationToken').as('users.deleteNotificationToken')
  // Route.delete('/:id', 'UsersController.delete').as('users.delete')
})
.prefix('/users')
.middleware(['auth'])

/**
 * User - Routes
 */
Route.group(() => {
  /** Follow - Routes */
  Route.group(() => {
    Route.get('/following', 'FollowController.listFollowing').as('user.listFollowing')
    Route.get('/followers', 'FollowController.listFollower').as('user.listFollower')
    Route.get('/is-following/:id', 'FollowController.isFollowing').as('user.isFollowing')
    Route.post('/', 'FollowController.storeFollower').as('user.storeFollower')
    Route.delete('/:id', 'FollowController.deleteFollower').as('user.deleteFollower')
  })
  .prefix('/follow')
})
.prefix('/user')
.middleware(['auth'])

/** Public Routes */
Route.group(() => {
  /** Auth - Routes */
  Route.post('/register', 'AuthController.register').as('auth.register')
  Route.post('/login', 'AuthController.login').as('auth.login')
  Route.post('/forgot-password', 'AuthController.forgotPassword').as('auth.forgotPassword')
  Route.get('/reset-password/:tempToken/:email', 'AuthController.resetPassword').as('auth.resetPassword')
  Route.get('/validate-username', 'AuthController.isUsernameAvailable').as('auth.isUsernameAvailable')
  Route.get('/validate-email', 'AuthController.isEmailAvailable').as('auth.isEmailAvailable')
  Route.post('/refresh-token', 'AuthController.refreshToken').as('auth.refreshToken')

  /** Private  Routes */
  Route.group(() => {
    /** Auth/Profile - Routes */
    Route.post('/edit-password', 'AuthController.editPassword').as('auth.editPassword')
    Route.get('/logout', 'AuthController.logout').as('auth.logout')
  })
  .prefix('/profile')
  .middleware(['auth'])
})
.prefix('/auth')
