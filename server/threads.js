const task = require('@touno-io/db/task')
const { Worker } = require('worker_threads')

module.exports = async (req, taskname, filename, data = {}) => {
  const job = await task.load(taskname)
  if (await job.isRunning()) return { run: async () => {}, state: () => job.getState() }

  return {
    async run (manual = false) {
      await job.initialize(manual)
      const worker = new Worker(filename, { workerData: Object.assign({}, data) })
      const logger = require('@touno-io/debuger')(`WORKER:${worker.threadId.toString().padStart(3, '0')}`)
      logger.start(taskname)
      worker.on('message', async ({ message, start, stop }) => {
        if (message) logger.log(message)
        if (start) {
          await job.start()
        } else if (stop) {
          await job.stop()
        } else {
          await job.processing()
        }
      })
      worker.on('error', ex => {
        job.error(ex)
        logger.error(ex)
      })
      worker.on('exit', code => {
        job.finish(code)
        logger.success(`EXIT ${code}`)
      })
      return job
    },
    async state () {
      return await job.getState()
    }
  }
}
