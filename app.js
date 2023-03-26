const fs = require('fs/promises')
const inquirer = require('inquirer')
const { XMLParser } = require("fast-xml-parser");

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
            name: 'radius',
            message: 'Radius:'
        }
    ])
    collisionsFolder = collisionsFolder.replace(/'/g, '')
    searchForCollision(collisionsFolder, coordsX, coordsY, coordsZ, searchRadius)
}

init()

async function searchForCollision(collisionsFolder, coordsX, coordsY, coordsZ, searchRadius) {
    let collisionFiles = await fs.readdir(collisionsFolder)
    let parser = new XMLParser({ ignoreAttributes: false })
    let found = 0
    let distances = []
    for (let fileName of collisionFiles) {
        let file = await fs.readFile(`${collisionsFolder}/${fileName}`, { encoding: 'utf-8' })
        let parsedFile = parser.parse(file)
        let { "@_x": centerX, "@_y": centerY, "@_z": centerZ, } = parsedFile.BoundsFile.Bounds.SphereCenter
        let { "@_value": radius } = parsedFile.BoundsFile.Bounds.SphereRadius
        let distance = Math.sqrt(((coordsX - centerX)**2 + (coordsY - centerY)**2 + (coordsZ - centerZ)**2))
        distances.push({ fileName, distance })
        if (distance <= searchRadius) {
            found++
            console.log(`Found possible collision in ${fileName}.\nCenter coords: ${centerX} ${centerY} ${centerZ}\nRadius: ${radius}`)
        }
        process.stdout.write('.')
    }
    process.stdout.write('\n')
    if (found == 0) {
        distances.sort((a, b) => a.distance < b.distance ? -1 : 1)
        console.log(`No possible collision has been found, the nearest possible is: ${distances.shift().fileName}`)
        let cmd
        do {
            let { command } = await inquirer.prompt({
                type: 'input',
                name: 'command',
                message: 'If you want to get the next one press n, otherwise q: '
            })
            cmd = command
            console.log(`Next possible collision: ${distances.shift().fileName}`)
        } while (cmd != 'q')
    }
}