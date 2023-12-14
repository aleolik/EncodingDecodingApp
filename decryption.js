const {Transform} = require('stream')
const {pipeline} = require("stream/promises")
const fs = require("fs/promises")

class Decrypt extends Transform {
    constructor(readFileSize){
        super()
        this.readFileSize = readFileSize
        this.decrypted = 0
    }
    _transform(chunk,encoding,callback){
       for (let i = 0;i<chunk.length;i++) {
        if (chunk[i] !== 255) chunk[i] = chunk[i] - 1
       }
       if (this.decrypted === 0)  console.log(`Decrypted : 0%...`)
       this.decrypted += chunk.length
       setTimeout(() => {
        console.log(`Decrypted : ${Math.floor((this.decrypted / this.readFileSize) * 100)}%${this.decrypted / this.readFileSize === 1 ? "" : "..."}`)
        callback(null,chunk)
       },50);
    }
};

const decrpytion = async() => {
    // encrypted evenNumbers.txt file
    const encryptedEvenNumbers = await fs.open("./encryptedEvenNumbers.txt","r")
    if (!encryptedEvenNumbers) throw new Error("encryptedEvenNumbers.txt does not exist!")
    // destination for decrypted file
    const decryptedEvenNumbers = await fs.open("./decryptedEvenNumbers.txt","w")
    const size = (await encryptedEvenNumbers.stat()).size
    // streams
    const highReadWaterMark = 16384 * 4 
    const highWriteWaterMark = 16384 * 1
    const rs = encryptedEvenNumbers.createReadStream({highWaterMark:highReadWaterMark})
    const ws = decryptedEvenNumbers.createWriteStream({highWaterMark:highWriteWaterMark}) 
    // create transform stream for encrypting content
    const transformStream = new Decrypt(size)
    await pipeline(rs,transformStream,ws)
}

module.exports = decrpytion