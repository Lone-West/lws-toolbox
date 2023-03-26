const fs = require('fs/promises')
const inquirer = require('inquirer')
const ThreadController = require('./Controller/ThreadController')
const os = require('os');

async function init() {
    let { collisionsFolder } = await inquirer.prompt({
        type: 'input',
        name: 'collisionsFolder',
        message: 'Path to collisions folder:',
        validate(answer) {
            if(answer.length < 1) {
                return "Invalid Path"
            }
    
            return true
        }
    })
    let { coordsX, coordsY, coordsZ, searchRadius } = await inquirer.prompt([
        {
            type: 'number',
            name: 'coordsX',
            message: 'X Coords:'
        },
        {
            type: 'number',
            name: 'coordsY',
            message: 'Y Coords:'
        },
        {
            type: 'number',
            name: 'coordsZ',
            message: 'Z Coords:'
        },
        {
            type: 'number',
            name: 'searchRadius',
            message: 'Radius:'
        }
    ])
    collisionsFolder = collisionsFolder.replace(/'/g, '')
    let collisionFiles = await fs.readdir(collisionsFolder)
    const searchController = new ThreadController(os.cpus().length, 'search_worker.js', collisionFiles, { collisionsFolder, coordsX, coordsY, coordsZ, searchRadius })
    let threadResults = await searchController.startThreadedJob()
    let result = []
    for (let threadId in threadResults) {
        result.push(...threadResults[threadId])
    }
    result.sort((a, b) => a.distance < b.distance ? -1 : 1)
    console.log(`${result.length} possible collisions found.`)
    console.log(result)
}

init()
