import serv from '@touno-io/server'
import auth from './auth'
import exhentai from './server/exhentai.org'


serv.create('web.opensource').then(async app => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Token, X-Access')
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Credentials', true)
    if (req.method === 'OPTIONS') return res.sendStatus(200)
    next()
  })

  app.use('/app', auth)

  app.use('/api/exhentai', exhentai)
 
  await app.start()
}).catch(ex => {
  console.log(ex)
  serv.close()
})