const { Worker } = require('node:worker_threads');
const os = require('os')

class ThreadController {

    constructor(threads = 1, workerFile, work, workerData) {
        this.threads = threads
        if (!workerFile)
            throw new Error('Missing workerFile name')
        this.workerFile = workerFile
        this.workerData = workerData
        this.work = work
        this.activeThreads = 0
    }

    async startThreadedJob() {
        return new Promise((resolve) => {
            let finalResult = {}
            for (let i = 0; i < this.threads; i++) {
                this.activeThreads++
                let startPos = i*(this.work.length/this.threads)
                let endPos = startPos+(this.work.length/this.threads)
                let workSlice = this.work.slice(startPos, endPos)
                
                const worker = new Worker(`./Worker/${this.workerFile}`, { workerData: { work: workSlice, data: this.workerData } })
                
                worker.on('message', (message) => {
                    finalResult[worker.threadId] = message
                });
        
                worker.on('exit', () => {
                    --this.activeThreads
                    if (this.activeThreads <= 0) {
                        resolve(finalResult)
                    }
                });
            }
        })
    }

}

module.exports = ThreadController