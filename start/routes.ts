import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import AutoSwagger from 'adonis-autoswagger'
import swagger from 'Config/swagger'

Route.get('/health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

import 'App/Routes/UserRoutes'
import 'App/Routes/PostRoutes'
import 'App/Routes/MessageRoutes'

Route.get('/', () => {
  return 'Hello world'
})

Route.get('/swagger', async () => {
  return AutoSwagger.docs(Route.toJSON() as any, swagger)
})

Route.get('/docs', async () => {
  return AutoSwagger.ui('/swagger')
})
