const { Storage } = require('megajs')
const fs = require('fs')
const credentials = require('../credentials')
// const storageConfig = require('../config/storage')

const storageConfig = new Storage({
    email: credentials.mega_config.email,
    password: credentials.mega_config.password,
    userAgent: 'ExampleClient/1.0'
  })
async function uploadFile(file) {
    try {
        const contentFile = fs.readFileSync(file.path, {encoding: 'base64'})
        const storage = await storageConfig.ready
        const fileUpload = await storage.upload(file.originalFilename, Buffer.from(contentFile, 'base64')).complete
        const fileUploadLink = await fileUpload.link()
        return fileUploadLink
    }catch(err) {
        console.log(err)
        return null
    }
    
}
module.exports = uploadFile;