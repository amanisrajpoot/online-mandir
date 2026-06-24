import * as shortUUID from 'short-uuid'
console.log("shortUUID namespace:", Object.keys(shortUUID))
console.log("shortUUID type:", typeof shortUUID)
if (shortUUID.default) {
  console.log("default type:", typeof shortUUID.default)
}
