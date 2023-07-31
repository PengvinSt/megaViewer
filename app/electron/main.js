const { app,screen, BrowserWindow, Menu, Tray } = require('electron') 
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

const createMainWindow = () =>{
    const {width, height} = screen.getPrimaryDisplay().workAreaSize

    let window = new BrowserWindow({
        backgroundColor:'#f1c40f',
        width: 800,
        height: 500,
        minWidth:400,
        minHeight:400,
        maxHeight:height,
        maxWidth:width,
        show:false,
        webPreferences: {
        worldSafeExecuteJavaScript: true,
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
        window.loadURL("http://localhost:40992");
    } else {
        window.loadFile("app/dist/index.html");
    }
}

app.on('ready', createMainWindow)