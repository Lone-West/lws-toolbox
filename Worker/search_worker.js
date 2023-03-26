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
        let distance = Math.sqrt(((coordsX - centerX)**2 + (coordsY - centerY)**2 + (coordsZ - centerZ)**2))
        if (distance <= searchRadius) {
            distances.push({ fileName, distance })
        }
    }
    parentPort.postMessage(distances)
}

search()