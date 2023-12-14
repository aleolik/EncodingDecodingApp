const fs = require("fs");
const writeEvenNumbers = async() => {
    return new Promise((resolve,reject) => {
        fs.open("evenNumbers.txt","r",(err,fd) => {
            // create evenNmber.txt file , only if it does not exist
            if (err) {
                fs.open("evenNumbers.txt","w",async(err,fd) => {
                    if (err) return reject(new Error(err.message));
                    const ws = fs.createWriteStream(null,{fd:fd,encoding:"utf-8"})
                    let currentEvenNum = 0
                    const writeEvenNumsToStream = async() => {
                        while (currentEvenNum <= 10 ** 6) {
                            const buff = Buffer.from(` ${currentEvenNum} `)
                            if (currentEvenNum === 10 ** 6) return ws.end(buff)
                            if (!ws.write(buff)) break;// internal buffer in stream is fullfilled,wait for drain event
                            currentEvenNum += 2
                        }
                    }
                    ws.on("drain",async() => {
                        await writeEvenNumsToStream()
                    })
                    ws.on("finish",() => {
                        console.timeEnd("writeEven")
                        return resolve()
                    })
                    console.time("writeEven")
                    await writeEvenNumsToStream()
                })
            }
        })
    })
}


module.exports = writeEvenNumbers