const { ipcRenderer, contextBridge } = require('electron') 


const getCurrentFilePath = () => ipcRenderer.invoke('getCurrentFilePath')
const getStartingPath = () => ipcRenderer.invoke('getStartingPath')



const getFilesFromPath = (path)=> ipcRenderer.invoke('getFilesFromPath', path)

const getDiskSpace = (path)=> ipcRenderer.invoke('getDiskSpace', path)

const spawnPropertiesWindow = (data)=> ipcRenderer.send('spawnPropertiesWindow',data)

const closePropWindow = () => ipcRenderer.send('closePropWindow')

const getWindowData = ()=> ipcRenderer.invoke('getWindowData')

const getFilesName = (path)=> ipcRenderer.invoke('getFilesName', path)
const getFolderSize = (path)=> ipcRenderer.invoke('getFolderSize', path)
const getMoreInfo = (path)=> ipcRenderer.invoke('getMoreInfo', path)


contextBridge.exposeInMainWorld('api',{
    getFilesName,
    getMoreInfo,
    getFolderSize,
    getCurrentFilePath,
    spawnPropertiesWindow,
    getDiskSpace,
    getStartingPath,
    getFilesFromPath,
    closePropWindow,
    getWindowData
})
