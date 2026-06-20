import { Base } from './Base.js'

export class Permission extends Base {
  constructor(id: string, name: string, description: string) {
    super(id, name, description)
  }
}
