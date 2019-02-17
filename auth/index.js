import express from 'express'

import security from './security'
import account from './account'

const router = express.Router()

router.use(security)
router.post('/token', account)

export default router
