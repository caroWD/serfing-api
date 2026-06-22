import { config } from 'dotenv'

const env = process.env.NODE_ENV || 'development'

switch (env) {
  case 'development': {
    config({ path: '.env.development.local' })
    break
  }

  case 'production': {
    config({ path: '.env.production.local' })
    break
  }

  default: {
    throw new Error(`Unknown environment: ${env}`)
  }
}
