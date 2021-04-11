const fastify = require('fastify')({ logger: false })
const { touno } = require('@touno-io/db/schema')
const logger = require('@touno-io/debuger')('GRPC')

const init = async () => {
  await touno.open()
  
  fastify.get('/health', (req, reply) => {
    const { Resume } = touno.get()
    Resume.countDocuments((err) => {
      reply.code(err ? 500 : 200).send(err ? 'FAIL' : 'OK')
    })
  })
  
  fastify.route(require('./server/api/resume'))
  fastify.route(require('./server/api/rotomu'))
  
  await fastify.listen(3000, '0.0.0.0')
  console.log('Server running on %s', '0.0.0.0:30000')
}

process.on('unhandledRejection', async (err) => {
  console.error(err)
  process.exit(1)
})

init().catch(async ex => {
  await touno.close()
  logger.error(ex)
})
