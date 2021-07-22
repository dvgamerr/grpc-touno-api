const axios = require('axios')
const wakaRank = require('./waka-rank')

const wakaApiLeaderboards = `https://wakatime.com/api/v1/users/current/leaderboards`
const lineBot = (token, meesage) => {
  return axios.put(`${process.env.NOTIFY}line/ris-robo/${token}`, typeof meesage === 'string' ? { type: 'text', meesage } : meesage)
}

module.exports = {
  method: ['GET','PUT'],
  path: '/api/leaderbord/:key/:id',
  handler: async (req) => {
    const { id, key } = req.params
    const { data: { data: leaderbords } } = await axios(`${wakaApiLeaderboards}/${id}?api_key=${key}`)
    const flex = wakaRank(leaderbords)
    lineBot(process.env.NODE_ENV == 'development' ? 'kem' : 'sru', flex).catch(ex => {
      console.log(ex.response)
    })
    return flex
  }
}
