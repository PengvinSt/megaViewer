const { app,screen, BrowserWindow, Menu, ipcMain, webContents } = require('electron'); 
const { readdirSync } = require('fs');
const path = require('path')

const lock = app.requestSingleInstanceLock()
const isDevelopment = process.env.NODE_ENV === "development";
const drivelist = require('drivelist');


const fs = require("fs")
const {Worker} = require('worker_threads')


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



ipcMain.handle('spawnPropertiesWindow', (_, mainData)=>{
    if(mainData.path !== undefined){
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
            ipcMain.removeHandler('getWindowData')
            return mainData
        })
        
        ipcMain.on('closePropWindow', (_, uid)=>{
            if(mainData._uid === uid){
                window.destroy()
                ipcMain.removeHandler('getFolderSize')
            }
        })

        let allSize = 0
        let allFiles = 0
        let allFolders = 0
        const getDirSize = async (dirPath) => {
            let size = 0
            const files = await fs.promises.readdir(dirPath)
          
            for (let i = 0; i < files.length; i++) {
              const filePath = path.join(dirPath, files[i])
              const stats = await fs.promises.stat(filePath)
               
              if (stats.isFile()) {
                size += stats.size
                allSize += stats.size
                allFiles += 1
                window.webContents.send('updateDirSize', {
                    size: allSize,
                    folders: allFolders,
                    files: allFiles
                })
              } else if (stats.isDirectory()) {
                // const worker = new Worker(path.join(__dirname + '/workers/folderSizeWorker.js'))
                // worker.on('message', (data)=>console.log(data))
                allFolders += 1
                size += await getDirSize(filePath)
              }
              
            }
            return size;
        }
        ipcMain.on('getFolderSize', async (_, data) => {
            if(mainData._uid === data.uid){
            const size = await getDirSize(data.path)
            const dataSend = {
                size,
                folders: allFolders,
                files: allFiles
            }
            window.webContents.send('updateFinalDirSize', dataSend)
            }
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
    let innerSettings = JSON.parse(fs.readFileSync(path.join(__dirname, '/innerSettings.json'),"utf8"))
    console.log(innerSettings)
    const {width, height} = screen.getPrimaryDisplay().size
    let window = new BrowserWindow({
        backgroundColor:"#1C2321",
        width: innerSettings.window.windowSize.width,
        height: innerSettings.window.windowSize.height,
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
    ipcMain.handle('innerSettings', ()=>{
        return innerSettings
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

    ipcMain.handle('findFile', async (_, data) => {
        let allFindFiles = []
        const findFile = async (data) => {
            const pathFind = data.path.length <3 ? data.path + '\\' : data.path
            let files = await fs.promises.readdir(pathFind, {withFileTypes: true})
            console.log(files)
            files = files.filter(file => file.name !== 'System Volume Information' && file.name !== 'WindowsApps' && file.name !== '$Recycle.Bin' && file.name !== 'MSOCache')
            console.log('Searchiing in:', pathFind)
            for (let i = 0; i < files.length; i++) {
              const filePath = path.join(pathFind, files[i].name)  
              if(files[i].name.toLowerCase().includes(data.searhFile.toLowerCase())){
                allFindFiles.push({
                    name: files[i].name,
                    path: filePath,
                    type:files[i].isDirectory() ? "Directory" : "File"
                })
                window.webContents.send('updateFindFiles', allFindFiles)
              }
              if(files[i].isDirectory()){
                try{
                    await findFile({path:filePath, searhFile:data.searhFile})
                }catch(error){
                    console.log(error)
                }
              }
            }
        }
        await findFile(data)
        
        return allFindFiles
    })
    ipcMain.on('stopFindFile', async (_, data) => {
        ipcMain.removeHandler('findFile')
    })
    ipcMain.on('openTerminal', (_, data)=>{
        const child_process = require('child_process')
        let editor = process.env.EDITOR || 'vi';

        let child = child_process.spawn(editor, [data.path], {
            stdio: 'inherit'
        });
    })
    ipcMain.on('updateInnerSettings', (_, data) => {
        fs.writeFileSync(path.join(__dirname, '/innerSettings.json'),JSON.stringify(data.newInnerSettings))
        innerSettings = data.newInnerSettings
    })

    window.on('close', ()=>{
        const size = window.getSize()
        innerSettings.window.windowSize.width = size[0]
        innerSettings.window.windowSize.height = size[1]
        fs.writeFileSync(path.join(__dirname, '/innerSettings.json'),JSON.stringify(innerSettings))
    })
}

app.on('ready', createMainWindow)