const { XMLParser } = require("fast-xml-parser");
const fs = require('fs/promises')
const { parentPort, workerData } = require('node:worker_threads');

async function search() {
    let collisionFiles = workerData.work
    let { collisionsFolder, coordsX, coordsY, coordsZ, searchRadius } = workerData.data
    let parser = new XMLParser({ ignoreAttributes: false })
    let distances = []
    for (let fileName of collisionFiles) {
        let file = await fs.readFile(`${collisionsFolder}/${fileName}`, { encoding: 'utf-8' })
        let parsedFile = parser.parse(file)
        let { "@_x": centerX, "@_y": centerY, "@_z": centerZ, } = parsedFile.BoundsFile.Bounds.SphereCenter
        let minX = parsedFile.BoundsFile.Bounds.BoxMin['@_x']
        let minY = parsedFile.BoundsFile.Bounds.BoxMin['@_y']
        let maxX = parsedFile.BoundsFile.Bounds.BoxMax['@_x']
        let maxY = parsedFile.BoundsFile.Bounds.BoxMax['@_y']
        let distance = Math.sqrt(((coordsX - centerX)**2 + (coordsY - centerY)**2))
        if (coordsX >= minX && coordsY >= minY) {
            if (coordsX <= maxX && coordsX <= maxY) {
                distances.push({ fileName, distance: distance })
            }
        }
        // if (distance <= searchRadius) {
        //     distances.push({ fileName, distance })
        // }
    }
    parentPort.postMessage(distances)
}

search()