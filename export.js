const fs = require('fs/promises')
const inquirer = require('inquirer')
const { Worker } = require('node:worker_threads');
const os = require('os')

async function init() {
    let { collisionsFolder } = await inquirer.prompt({
        type: 'input',
        name: 'collisionsFolder',
        message: 'Path to collision folder:',
        validate(answer) {
            if(answer.length < 1) {
                return "Invalid path"
            }
    
            return true
        }
    })
    console.time('export')
    collisionsFolder = collisionsFolder.replace(/'/g, '')
    let collisionFiles = await fs.readdir(collisionsFolder)
    let threads = os.cpus().length
    let activeThreads = 0
    let finalCollision = {}
    console.log(`Using ${threads} threads`)
    for (let i = 0; i < threads; i++) {
        activeThreads++
        let startPos = i*(collisionFiles.length/threads)
        let endPos = startPos+(collisionFiles.length/threads)
        let fileSlice = collisionFiles.slice(startPos, endPos)
        const worker = new Worker(`${__dirname}/export_worker.js`, { workerData: { collisionsFolder, collisionFiles: fileSlice } })
        worker.on('message', (message) => {
            Object.assign(finalCollision, message)
        });

        worker.on('exit', () => {
            console.log('Parsing thread closed.');
            --activeThreads
            if (activeThreads <= 0) {
                console.timeLog('export')
                fs.writeFile('out.json', JSON.stringify(finalCollision), { encoding: 'utf-8' })
            }
        });
    }
}

init()