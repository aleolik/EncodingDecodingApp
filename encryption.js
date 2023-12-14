const {Transform} = require('stream')
const {pipeline} = require("stream/promises")
const fs= require("fs/promises")

class Encrypt extends Transform {
    constructor(readFileSize){
        super()
        this.readFileSize = readFileSize
        this.encrypted = 0
    }
    _transform(chunk,encoding,callback){
       for (let i = 0;i<chunk.length;i++) {
        if (chunk[i] + 1 <= 255) chunk[i] = chunk[i] + 1
       }
       if (this.encrypted === 0)  console.log(`Encrypted : 0%...`)
       this.encrypted += chunk.length
       setTimeout(() => {
        console.log(`Encrypted : ${Math.floor((this.encrypted / this.readFileSize) * 100)}%${this.encrypted / this.readFileSize === 1 ? "" : "..."}`)
        callback(null,chunk)
       },50);
    }
};


const encryption = async() => {
    // read content from evenNumbers.txt file
    const evenNumbersFile = await fs.open("./evenNumbers.txt","r")
    if (!evenNumbersFile) throw new Error("evenNumbers.txt does not exist")
    // prepare destination file,where encrypred content will be stored
    const encryptedFile = await fs.open("./encryptedEvenNumbers.txt","w")
    const size = (await evenNumbersFile.stat()).size
    // streams
    const highReadWaterMark = 16384 * 4 
    const highWriteWaterMark = 16384 * 1
    const rs = evenNumbersFile.createReadStream({highWaterMark : highReadWaterMark})
    const ws = encryptedFile.createWriteStream({highWaterMark : highWriteWaterMark})
    // create transform stream for encrypting content
    const transformStream = new Encrypt(size)
    await pipeline(rs,transformStream,ws)
}

module.exports = encryption
