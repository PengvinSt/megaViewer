const { app,screen, BrowserWindow, Menu, ipcMain, fs } = require('electron'); 
const { readdir, readdirSync } = require('fs');
const path = require('path')



const lock = app.requestSingleInstanceLock()

const isDevelopment = process.env.NODE_ENV === "development";

if(!lock){
    app.quit()
}else{
    app.on('second-instance',()=>{
    app.focus()
    })
}

ipcMain.handle('getCurrentFilePath', ()=>{
    const path = app.getAppPath()
    return path
})

ipcMain.handle('getFilesFromPath', (_, path)=>{
    let results = readdirSync(path,{withFileTypes: true})
    return results.map(file => ({
        name: file.name,
        type: file.isDirectory() ? "Folder" : "File",
    }))
})




const createMainWindow = () =>{
    const {width, height} = screen.getPrimaryDisplay().size

    let window = new BrowserWindow({
        backgroundColor:"#1C2321",
        width: 800,
        height: 600,
        minWidth:600,
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
        window.focus()
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