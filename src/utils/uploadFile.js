const { Storage } = require('megajs')
const fs = require('fs')

const storageConfig = new Storage({
    email: process.env.MEGA_EMAIL,
    password: process.env.MEGA_PASSWORD,
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