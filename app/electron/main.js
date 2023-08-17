const { app,screen, BrowserWindow, Menu, ipcMain } = require('electron'); 
const { readdir, readdirSync } = require('fs');
const path = require('path')
const checkDiskSpace = require('check-disk-space').default
const lock = app.requestSingleInstanceLock()
const isDevelopment = process.env.NODE_ENV === "development";
const drivelist = require('drivelist');

const fs = require("fs")

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

ipcMain.handle('getFilesFromPath', async (_, path)=>{
    const fixedPath = `${path}\\`
    let rawData = readdirSync(fixedPath,{withFileTypes: true})
    const promiseResults = await Promise.allSettled(rawData.map(async (file) =>{
        const Stats = await getFileStats(fixedPath + file.name)
        return {
            name: file.name,
            type: file.isDirectory() ? "Folder" : "File",
            Stats
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
        const diskInfo = await checkDiskSpace(path)
        return diskInfo

    } else if (process.platform == 'linux') { // Run df for Linux.
        // in development
    } else {
        // in development
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