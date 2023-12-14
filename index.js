const writeEvenNumbers = require("./writeEvenNumbers");
const encryption = require("./encryption");
const decrpytion = require("./decryption");
(async() => {
    try {
        // create evenNumbers.txt file to test encrypt/decrypt app
        // will work only if evenNumbers.txt does not exist
        await writeEvenNumbers()
        // create evenNumbers.txt file and fill it with encrypted content of evenNumbers.txt file
        await encryption()
        // // create evenNumbersDecrypted.txt file and fill it with decrpyted content of encryptedEvenNumbers.txt file
        await decrpytion()
    } catch (e) {
        console.error(e.message)
    }
})();