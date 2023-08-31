const { ipcRenderer, contextBridge } = require('electron') 


const getCurrentFilePath = () => ipcRenderer.invoke('getCurrentFilePath')
const getStartingPath = () => ipcRenderer.invoke('getStartingPath')



const getFilesFromPath = (path)=> ipcRenderer.invoke('getFilesFromPath', path)

const getDiskSpace = (path)=> ipcRenderer.invoke('getDiskSpace', path)

const spawnPropertiesWindow = (data)=> ipcRenderer.invoke('spawnPropertiesWindow',data)

const closePropWindow = (uid) => ipcRenderer.send('closePropWindow', uid)

const getWindowData = ()=> ipcRenderer.invoke('getWindowData')

const getFilesName = (data)=> ipcRenderer.invoke('getFilesName', data)
const getFolderSize = (path)=> ipcRenderer.send('getFolderSize', path)
const findFile = (data)=> ipcRenderer.invoke('findFile', data)
const stopFindFile = ()=> ipcRenderer.send('stopFindFile')
const openTerminal = (data)=> ipcRenderer.send('openTerminal', data)
const moveFileToTrash = (data)=> ipcRenderer.invoke('moveFileToTrash', data)
const updateInnerSettings = (data)=> ipcRenderer.send('updateInnerSettings', data)
const updateFindFiles = (data)=> ipcRenderer.on('updateFindFiles', data)
const getMoreInfo = (path)=> ipcRenderer.invoke('getMoreInfo', path)

const copyDataToClipboard = (data)=> ipcRenderer.send('copyDataToClipboard', data)

const updateDirSize = (size)=> ipcRenderer.on('updateDirSize', size)
const updateFinalDirSize = (size)=> ipcRenderer.on('updateFinalDirSize', size)

const renameData = (data)=> ipcRenderer.invoke('renameData', data)

const innerSettings = (data)=> ipcRenderer.invoke('innerSettings', data)
const openNewOfflineExplorerWindow = (data)=> ipcRenderer.invoke('openNewOfflineExplorerWindow', data)

contextBridge.exposeInMainWorld('api',{
    getFilesName,
    renameData,
    openNewOfflineExplorerWindow,
    copyDataToClipboard,
    moveFileToTrash,
    updateInnerSettings,
    openTerminal,
    stopFindFile,
    updateFindFiles,
    findFile,
    innerSettings,
    updateDirSize,
    updateFinalDirSize,
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
