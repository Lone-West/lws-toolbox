const { XMLParser } = require("fast-xml-parser");
const fs = require('fs/promises')
const { parentPort, workerData } = require('node:worker_threads');

async function parse() {
    let collisionFiles = workerData.work
    let { collisionsFolder } = workerData.data
    let parser = new XMLParser({ ignoreAttributes: false })
    let collisionsCollection = {}
    let i = 0
    for (let fileName of collisionFiles) {
        let file = await fs.readFile(`${collisionsFolder}/${fileName}`, { encoding: 'utf-8' })
        let parsedFile = parser.parse(file)
        let collision = {
            SphereBounds: {
                centerX: parsedFile.BoundsFile.Bounds.SphereCenter['@_x'],
                centerY: parsedFile.BoundsFile.Bounds.SphereCenter['@_y'],
                centerZ: parsedFile.BoundsFile.Bounds.SphereCenter['@_z'],
                radius: parsedFile.BoundsFile.Bounds.SphereRadius['@_value']
            },
            BoxBounds: {
                boxMin: { 
                    x: parsedFile.BoundsFile.Bounds.BoxMin['@_x'],
                    y: parsedFile.BoundsFile.Bounds.BoxMin['@_y'],
                    z: parsedFile.BoundsFile.Bounds.BoxMin['@_z']
                },
                boxMax: {
                    x: parsedFile.BoundsFile.Bounds.BoxMax['@_x'],
                    y: parsedFile.BoundsFile.Bounds.BoxMax['@_y'],
                    z: parsedFile.BoundsFile.Bounds.BoxMax['@_z']
                },
                boxCenter: {
                    x: parsedFile.BoundsFile.Bounds.BoxCenter['@_x'],
                    y: parsedFile.BoundsFile.Bounds.BoxCenter['@_y'],
                    z: parsedFile.BoundsFile.Bounds.BoxCenter['@_z']
                }
            }
        }
        i++
        let friendlyFileName = fileName.slice(0, fileName.indexOf('.'))
        collisionsCollection[friendlyFileName] = collision
        parentPort.postMessage(collisionsCollection)
    }
}

parse()