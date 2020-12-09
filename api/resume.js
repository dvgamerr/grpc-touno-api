const { touno } = require('@touno-io/db/schema')

module.exports = {
  method: ['GET','POST'],
  path: '/api/resume',
  handler: async (request) => {
    await touno.open()
    const { Resume } = touno.get()
    if (!request.payload) {
      const data = {}
      const resume = await Resume.find({}, 'section content', { $sort: { section: 1 } })
      for (const raw of resume) {
        data[raw.section] = raw.content
      }
      if (!resume.length) { throw new Error('Profile is null.') }
      return data
    } else {
      let ok = 0
      for (const key in request.payload) {
        const section = await Resume.findOne({ section: key })
        if (!section) { throw new Error(`Resume section ${key} not found.`) }
        const result = await Resume.updateOne({ section: key }, { $set: { content: request.payload[key], updated: new Date() } })
        ok += result.ok
      }
      return { ok }
    }
  }
}