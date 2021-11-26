const fastify = require('fastify')({ logger: false })
const Sentry = require('@sentry/node')
const os = require('os')
const { touno, myself } = require('@touno-io/db/schema')
const logger = require('@touno-io/debuger')('API')

const pkg = require('./package.json')
const infoInit = {
  serverName: os.hostname(),
  environment: process.env.NODE_ENV || 'development',
  release: pkg.name || 'funcless',
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0
}
logger.info('Sentry:', JSON.stringify(infoInit))
Sentry.init(infoInit)

fastify.setErrorHandler(function (ex, req, reply) {
  logger.error(ex)
  Sentry.captureException(ex)
  reply.status(500).send(ex)
})

fastify.register(require('fastify-cors'))
fastify.register((fastify, options, done) => {
  fastify.addHook('onRequest', (req, reply, done) => {
    reply.header('x-developer', '@dvgamerr')
    done()
  })

  fastify.get('/health', (req, reply) => reply.code(200).send('☕'))
  done()
})

fastify.route(require('./server/api/wakatime/leaderbords'))
fastify.route(require('./server/api/rotomu'))
fastify.route(require('./server/api/resume'))
fastify.route(require('./server/api/cron/wakatime'))

for (const cinema of require('./server/api/cron/cinema')) {
  fastify.route(cinema)
}

const initialize = async () => {
  await touno.open()
  await myself.open()
}

const exitHandler = (err, exitCode) => {
  touno.close()
  myself.close()
  logger.error(`${exitCode}:Exiting... (${err})`)
  process.exit(0)
}

process.on('SIGINT', exitHandler)
process.on('SIGTERM', exitHandler)
process.on('SIGUSR1', exitHandler)
process.on('SIGUSR2', exitHandler)
process.on('uncaughtException', exitHandler)

initialize().then(async () => {

  await fastify.listen(3000, '0.0.0.0')
  logger.info('fastify listen:3000')
}).catch(async (ex) => {
  Sentry.captureException(ex)
  fastify.log.error(ex)
  logger.error(ex)
  process.exit(1)
})
