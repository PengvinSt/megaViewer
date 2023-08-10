const { ipcRenderer, contextBridge } = require('electron') 
// const { readdir } = require("fs/promises")

// const directoryContents = async (path) => {
//     let results = await readdir(path, {withFileTypes: true})
//     console.log(results)
//     return results.map(entry => ({
//       name: entry.name,
//       type: entry.isDirectory() ? "directory" : "file",
//     }))
// }


const getCurrentFilePath = () => ipcRenderer.invoke('getCurrentFilePath')
const getStartingPath = () => ipcRenderer.invoke('getStartingPath')


const getFilesFromPath = (path)=> ipcRenderer.invoke('getFilesFromPath', path)

const getDiskSpace = (path)=> ipcRenderer.invoke('getDiskSpace', path)

contextBridge.exposeInMainWorld('api',{
    getCurrentFilePath,
    getDiskSpace,
    getStartingPath,
    getFilesFromPath
})