const fs = require('fs/promises')
const inquirer = require('inquirer')
const { XMLParser } = require("fast-xml-parser");

async function init() {
    let { collisionsFolder } = await inquirer.prompt({
        type: 'input',
        name: 'collisionsFolder',
        message: 'Percorso alla cartella contenente i file delle collisioni:',
        validate(answer) {
            if(answer.length < 1) {
                return "Percorso non valido"
            }
    
            return true
        }
    })
    let { coordsX, coordsY, coordsZ, searchRadius } = await inquirer.prompt([
        {
            type: 'number',
            name: 'coordsX',
            message: 'Coordinata X:'
        },
        {
            type: 'number',
            name: 'coordsY',
            message: 'Coordinata Y:'
        },
        {
            type: 'number',
            name: 'coordsZ',
            message: 'Coordinata Z:'
        },
        {
            type: 'number',
            name: 'radius',
            message: 'Raggio:'
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
            console.log(`Trovata possibile collisione in ${fileName}.\nCoordinate centro: ${centerX} ${centerY} ${centerZ}\nRaggio: ${radius}`)
        }
        process.stdout.write('.')
    }
    process.stdout.write('\n')
    if (found == 0) {
        distances.sort((a, b) => a.distance < b.distance ? -1 : 1)
        console.log(`Nessuna collisione possibile trovata, la più vicina è: ${distances.shift().fileName}`)
        let cmd
        do {
            let { command } = await inquirer.prompt({
                type: 'input',
                name: 'command',
                message: 'Se vuoi andare alla prossima, digita n altrimenti q per uscire: '
            })
            cmd = command
            console.log(`Prossima più probabile: ${distances.shift().fileName}`)
        } while (cmd != 'q')
    }
}