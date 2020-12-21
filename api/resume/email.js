const { touno } = require('@touno-io/db/schema')
const axios = require('axios')

const secret = process.env.RECAPTCHA_SECRET
const siteverify = process.env.RECAPTCHA_ENDPOINT || 'https://www.google.com/recaptcha/api/siteverify'

module.exports = {
  method: ['POST'],
  path: '/api/resume/email',
  handler: async (request) => {
    const response = request.payload.token
    if (!secret || !response) { throw new Error('Token Recaptcha expired.') }
    await touno.open()
    const { ResumeContact } = touno.get()

    const { data } = await axios({ method: 'post', url: siteverify, formData: { secret, response } })
    if (!data.success) { throw new Error(data['error-codes']) }

    await new ResumeContact(Object.assign({
      sended: false,
      score: data.score,
      challenge: new Date(data.challenge_ts),
      created: new Date()
    }, request.payload)).save()
    // // name || !this.msg.email || !this.msg.subject || !this.msg.text
    await axios.put('https://notice.touno.io/mr-touno/sentinel', {
      type: 'text',
      text: `Your got message! by ${request.payload.name}<${request.payload.email}>\n*${request.payload.subject}*\n${request.payload.text}`
    })

    return { error: null }
  }
}