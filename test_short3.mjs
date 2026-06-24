import shortUUID from 'short-uuid'
console.log("has generate?", typeof shortUUID.generate)
console.log("has fromUUID?", typeof shortUUID.fromUUID)
const translator = shortUUID.createTranslator ? shortUUID.createTranslator() : shortUUID()
console.log("translator keys", Object.keys(translator))
