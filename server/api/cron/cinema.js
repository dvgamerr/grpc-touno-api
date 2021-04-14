const thread = require('../../threads')

module.exports = [
  {
    method: 'POST',
    path: '/api/cron/cinema-daily',
    handler: async () => {
      const job = await thread('cinema-daily', './task/cinema/index.js', { eventName: 'daily' })
  
      await job.run(true)
      return await job.state()
    }
  },
  {
    method: 'POST',
    path: '/api/cron/cinema-weekly',
    handler: async () => {
      const job = await thread('cinema-weekly', './task/cinema/index.js', { eventName: 'weekly' })
  
      await job.run(true)
      return await job.state()
    }
  },
  {
    method: 'POST',
    path: '/api/cron/cinema-dl',
    handler: async () => {
      const job = await thread('cinema-dl', './task/cinema/index.js', { eventName: 'download' })
  
      await job.run(true)
      return await job.state()
    }
  }
]
