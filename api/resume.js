const { touno } = require('@touno-io/db/schema')

module.exports = {
  method: 'GET',
  path: '/api/resume',
  handler: async (request, reply) => {
    const { body } = request.payload
    const data = { error: null }
    await touno.open()
    const { Resume } = touno.get()
    if (!Object.keys(body).length) {
      const resume = await Resume.find({})
      for (const raw of resume) {
        data[raw.section] = raw.content
      }
      if (!resume.length) { throw new Error('Profile is null.') }
    } else {
      for (const key in body) {
        const section = await Resume.findOne({ section: key })
        if (!section) { throw new Error(`Resume section ${key} not found.`) }
        await Resume.updateOne({ section: key }, { $set: { content: body[key], updated: new Date() } })
      }
    }
    
    reply(data)
  }
}
