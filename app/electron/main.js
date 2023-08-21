const { app,screen, BrowserWindow, Menu, ipcMain } = require('electron'); 
const { readdirSync } = require('fs');
const path = require('path')

const lock = app.requestSingleInstanceLock()
const isDevelopment = process.env.NODE_ENV === "development";
const drivelist = require('drivelist');


const fs = require("fs")
const { promisify } = require('util')
const fastFolderSize = require('fast-folder-size')
const fastFolderSizeAsync = promisify(fastFolderSize)

if(!lock){
    app.quit()
}else{
    app.on('second-instance',()=>{
    app.focus()
    })
}
// deprecated --------------------------------
ipcMain.handle('getCurrentFilePath', ()=>{
    const path = app.getAppPath()
    return path
})
// deprecated --------------------------------

ipcMain.handle('getStartingPath', async ()=>{
    const drives = await drivelist.list();
    return drives
})



ipcMain.on('spawnPropertiesWindow', (_, data)=>{
    if(data.path !== undefined){
        let window = new BrowserWindow({
            backgroundColor:"#191919",
            width: 350,
            height: 500,
            maxWidth:350,
            maxHeight:500,
            minWidth:350,
            minHeight:500,
            show:false,
            frame:false,
            webPreferences: {
                worldSafeExecuteJavaScript: true,
                preload: path.join(__dirname, 'preload.js')
            }
        })
        
        const menu = new Menu()
        Menu.setApplicationMenu(menu)
        window.loadFile("app/src/windows/propertiesWindow.html");
        window.webContents.on('did-finish-load', ()=>{
            window.show()
            window.focus()
            // window.webContents.openDevTools()
        })       
        
        ipcMain.handle('getWindowData', ()=>{
            return data
        })
        
        ipcMain.on('closePropWindow', ()=>{
            window.destroy()
            ipcMain.removeHandler('getWindowData')
        })

    }
})


const getFileStats = async (path) => {
    try {
        const stats = await fs.promises.stat(path);
        return stats
    } catch (error) {
        console.log(error)
    }
}

ipcMain.handle('getFilesName', async (_, path)=>{
    const fixedPath = `${path}\\`
    let rawData = await fs.promises.readdir(fixedPath,{withFileTypes: true})
    let files = rawData.map(file=>{
        return {
            name: file.name,
            path:fixedPath + file.name,
            type: file.isDirectory() ? "Folder" : "File",
        }
    })
    // console.log(files.length)
    return files
})

ipcMain.handle('getFilesFromPath', async (_, path)=>{
    const fixedPath = `${path}\\`
    let rawData = readdirSync(fixedPath,{withFileTypes: true})
    const promiseResults = await Promise.allSettled(rawData.map(async (file) =>{
        const Stats = await getFileStats(fixedPath + file.name)
        if(file.isDirectory()){
            const thisDirFiles = await fs.promises.readdir(fixedPath+file.name);
            return {
                name: file.name,
                type: "Folder",
                isEmpty:thisDirFiles.length > 0 ? false : true,
                Stats
            }
        }else {
            return {
                name: file.name,
                type: "File",
                Stats
            }
        }
        
    }))
    const results = []
    const errors = []

    promiseResults.forEach((result)=>{
        if (result.status === 'fulfilled'){
            results.push(result.value)
            return
        }
        errors.push(result.reason)
    })
    // console.log(results)

    return results
})

ipcMain.handle('getDiskSpace', async (_, path)=>{
    if (process.platform == 'win32') { // Run wmic for Windows.
        // const diskInfo = await checkDiskSpace(path)
        const data = await fs.promises.statfs(path)
        const diskInfo = {
            diskPath:path.split(':')[0]+':',
            free:data.bsize*data.bfree,
            size:data.bsize*data.blocks
        }
        // console.log('Total free space',data.bsize*data.bfree);
        // console.log('Available for user',data.bsize*data.blocks);
        return diskInfo

    } else if (process.platform == 'linux') { // Run df for Linux.
        // in development
    } else {
        // in development
    }
})


ipcMain.handle('getFolderSize', async (_, path) => {
    const size = await fastFolderSizeAsync(path)
    return size
})

ipcMain.handle('getMoreInfo', async(_,path)=> {
    const rawData = await fs.promises.stat(path)
    if(rawData.isDirectory()){
        const data = {
            type:'Folder',
            dateC: rawData.birthtime,
            dateM: rawData.mtime,
        }
        return data
    }else {
        const data = {
            type:'File',
            dateC: rawData.birthtime,
            dateM: rawData.mtime,
            size: rawData.size
        }
        return data
    }
})

const createMainWindow = () =>{
    const {width, height} = screen.getPrimaryDisplay().size

    let window = new BrowserWindow({
        backgroundColor:"#1C2321",
        width: 800,
        height: 600,
        minWidth:720,
        minHeight:600,
        maxHeight:height,
        maxWidth:width,
        show:false,
        thickFrame:true,
        webPreferences: {
            worldSafeExecuteJavaScript: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    
    
    window.webContents.on('did-finish-load', ()=>{
        window.show()
        // window.focus()
    })

    if(isDevelopment){
        window.webContents.openDevTools()
    }else{
        const menu = new Menu()
        Menu.setApplicationMenu(menu)
    }
    
    if (isDevelopment) {
        window.loadURL("http://localhost:3000");
    } else {
        window.loadFile("app/dist/index.html");
    }
}

app.on('ready', createMainWindow)