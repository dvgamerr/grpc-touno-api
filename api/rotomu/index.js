const FlexPokedex = require('../../flex/pokedex')
const { task } = require('@touno-io/db/schema')
const axios = require('axios')

const replyBot = (token, text) => axios.put(`https://notice.touno.io/rotom/${token}`, typeof text === 'string' ? { type: 'text', text } : text)

const replyTest = [ '00000000000000000000000000000000', 'ffffffffffffffffffffffffffffffff' ]

const PokedexName = [
  'โรตอม',
  'โรโตมุ',
  'โรโตะมุ',
  'โระโตะมุ',
  'rotom',
  'rotomu',
  'ロトム',
  'poke',
  'pokedex',
  'โปเกเดก'
]

const normalizeText = (text) => (text || '').toLowerCase().trim()

module.exports = {
  method: ['POST'],
  path: '/api/rotomu',
  handler: async (request) => {
    console.log('request:', request.payload)
    if (!request.payload) return { statusCode: 400 } 
    if (!Array.isArray(request.payload.events)) return { statusCode: 400 } 
    if (!Array.isArray(request.payload.events)) return { statusCode: 400 } 

    await task.open()
    const { RotomuConfig, PokemonGo } = task.get()

    for await (const { source, message, replyToken } of request.payload.events) {
      const msg = normalizeText(message.text)
      if (replyTest.includes(replyToken)) continue

      const id = source.groupId || source.userId
  
      const IsOnline = await RotomuConfig.findOne({ id: id })
      if (PokedexName.includes(msg)) {
        // const profile = await client.getProfile(source.userId)
        if (IsOnline) {
          await replyBot(replyToken, 'ครับ!') // ครับ! ${profile.displayName}`
        } else {
          await replyBot(replyToken, `พร้อมใช้งานแล้วคับ!`) // `พร้อมใช้งานแล้วคับ! คุณ ${profile.displayName}`
          const bot = await RotomuConfig.findOne({ id: id })
          if (!bot) {
            await new RotomuConfig({
              id: id,
              type: source.type,
              permission: { news: true, pokedex: true, event: true },
              created: new Date()
            }).save()
          }
        }
      } else if (IsOnline) {
        let pokedex = null
        let getNo = /pokemon[\W](?<no>\d+)/ig.exec(msg)
        let getSearch = /(search|find|get)[\W](?<msg>.*)/ig.exec(msg)
        if (getNo) {
          pokedex = await PokemonGo.find({ number: parseInt(getNo.groups.no) })
          // logger.log(`pokemon: ${pokedex.length} item`)
          await replyBot(replyToken, FlexPokedex(pokedex))
        } else if (msg.length > 3) {
          pokedex = await PokemonGo.find({ name: { $in: [ new RegExp(!getSearch ? `^${msg}$` : getSearch.groups.msg, 'ig') ] } })
          if (pokedex.length !== 1) return

          await replyBot(replyToken, FlexPokedex(pokedex))
        }
      }
    }
    return { data: {}, statusCode: 400 } 
  }
}
