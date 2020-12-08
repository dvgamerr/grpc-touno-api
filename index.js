const Hapi = require('@hapi/hapi')

const init = async () => {
  const server = Hapi.server({ port: 3000, host: '0.0.0.0' })
  server.route({ method: 'GET', path: '/health', handler: () => 'OK' })
  server.route(require('./api/resume'))
  
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

init()

// import serv from '@touno-io/server'
// import token from './auth'
// import security from './auth/security'
// import exhentai from './server/exhentai.org'



// serv.create('web.opensource').then(async app => {
//   app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Token, X-Access')
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
//     res.setHeader('Access-Control-Allow-Credentials', true)
//     if (req.method === 'OPTIONS') return res.sendStatus(200)
//     next()
//   })

//   app.post('/app', token)

//   app.use('/api', security)
//   app.use('/api/ex', exhentai)
 
//   await app.start()
// }).catch(ex => {
//   console.log(ex)
//   serv.close()
// })