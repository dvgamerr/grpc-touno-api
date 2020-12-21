const Hapi = require('@hapi/hapi')

const init = async () => {
  const server = Hapi.server({ port: 3000, host: '0.0.0.0' })
  server.route({ method: 'GET', path: '/health', handler: () => 'OK' })
  server.route(require('./api/resume'))
  server.route(require('./api/resume/email'))
  
  server.route(require('./api/rotomu'))
  
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

init()
