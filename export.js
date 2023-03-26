const fs = require('fs/promises')
const inquirer = require('inquirer')
const { Worker } = require('node:worker_threads');
const os = require('os');
const ThreadController = require('./Controller/ThreadController');

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
    console.time('export_job')
    let collisionFiles = await fs.readdir(collisionsFolder)
    const exportController = new ThreadController(os.cpus().length, 'export_worker.js', collisionFiles, { collisionsFolder })
    let threadResults = await exportController.startThreadedJob()
    let result = {}
    for (let threadId in threadResults) {
        Object.assign(result, threadResults[threadId])
    }
    fs.writeFile('out.json', JSON.stringify(result), { encoding: 'utf-8' })
    console.log(`Exported ${Object.keys(result).length} collisions`)
    console.timeEnd('export_job')
}

init()