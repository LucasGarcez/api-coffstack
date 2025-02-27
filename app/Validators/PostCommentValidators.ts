import { schema } from '@ioc:Adonis/Core/Validator'

export namespace PostCommentValidators {
  export class Store {
    public schema = schema.create({
      post_id: schema.number(),
      message: schema.string(),
    })
  }

  export class Update {
    public schema = schema.create({
      message: schema.string(),
    })
  }
}
