const fastify = require('fastify')({ logger: false })
const { touno, myself } = require('@touno-io/db/schema')
const logger = require('@touno-io/debuger')('GRPC')

const init = async () => {
  await touno.open()
  await myself.open()
  
  fastify.get('/health', (req, reply) => {
    const { Resume } = touno.get()
    Resume.countDocuments((err) => {
      reply.code(err ? 500 : 200).send(err ? 'FAIL' : 'OK')
    })
  })
  
  fastify.route(require('./server/api/rotomu'))
  fastify.route(require('./server/api/resume'))
  fastify.route(require('./server/api/cron/wakatime'))

  for (const cinema of require('./server/api/cron/cinema')) {
    fastify.route(cinema)
  }
  
  await fastify.listen(3000, '0.0.0.0')
  logger.info('running on :3000')
}


const exitHandler = (err, exitCode) => {
  touno.close()
  myself.close()
  logger.error(`${exitCode}:Exiting... (${err})`)
  process.exit(0)
}

process.on('SIGINT', exitHandler)
process.on('SIGUSR1', exitHandler)
process.on('SIGUSR2', exitHandler)
process.on('uncaughtException', exitHandler)


init().catch(async (ex) => {
  logger.error(ex)
})
