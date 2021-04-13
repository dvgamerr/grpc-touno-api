const { myself } = require('@touno-io/db/schema')
const moment = require('moment')
const thread = require('../../threads')

module.exports = {
  method: ['GET','POST'],
  path: '/api/cron/wakatime',
  handler: async (req) => {
    const { WakaSummaries } = myself.get()
    const date = moment().startOf('day').add(-1, 'day')
    const yesterdayWakaTotal = await WakaSummaries.findOne({ type: 'grand_total', date })
    const job = await thread(req, 'wakatime-daily', './task/wakatime/index.js')
    if (yesterdayWakaTotal || req.method === 'GET') return await job.state()

    await job.run(true)
    return await job.state()
  }
}
