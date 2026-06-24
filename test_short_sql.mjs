import * as shortUUID from 'short-uuid'
const translator = shortUUID.createTranslator ? shortUUID.createTranslator() : (shortUUID.default ? shortUUID.default() : shortUUID())

const pujaId = '12345678-1234-1234-1234-1234567890ab' 
console.log("Shivratri short:", translator.fromUUID(pujaId))
