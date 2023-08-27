const closeButton = document.getElementById('close_button')


const nameHolderAndInput = document.getElementById('name_input')
const typeHolder = document.getElementById('type')
const pathHolder = document.getElementById('path')
const sizeHolder = document.getElementById('size')
const DateCHolder = document.getElementById('DateC')
const DateMHolder = document.getElementById('DateM')
const DateCKey = document.getElementById('DateC_key')
const DateMKey = document.getElementById('DateM_key')
const folderCountHolder = document.getElementById('folders_count') 
const fileCountHolder = document.getElementById('files_count') 

const sizeCircleBorder = document.getElementById('file_size_repr')
const sizeCircle = document.getElementById('file_size_repr_inner')

closeButton.addEventListener('click', () =>{
    window.api.closePropWindow(propData._uid)
})

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

let propData = {}

document.addEventListener('DOMContentLoaded', async ()=>{
    const data = await window.api.getWindowData()
    propData = data
    console.log(data)

    if(data.name){
        nameHolderAndInput.placeholder = data.name
    }
    
    pathHolder.value = data.path.replace('\\\\', '\\')
    typeHolder.innerHTML = data.type

    if(data.type === 'Disk'){
        fileCountHolder.innerHTML = `${data.filesCount} files`
        folderCountHolder.innerHTML = `${data.foldersCount} folders`
        sizeHolder.innerHTML = `Disk size ${data.size}`
        DateCKey.hidden = true
        DateMKey.hidden = true
    }
    if(data.type === 'Folder'){
        DateCHolder.innerHTML = data.dateC
        DateMHolder.innerHTML= data.dateM
        window.api.getFolderSize({
            path:data.path,
            uid:data._uid
        })
    }
    if(data.type === 'File'){
        DateCHolder.innerHTML = data.dateC
        DateMHolder.innerHTML= data.dateM
        sizeHolder.innerHTML = `File size ${formatBytes(data.size)}`
        sizeCircle.innerHTML = `${(100-(((data.diskSize-data.size)/data.diskSize)*100)).toFixed(2) < 0.01 ? '>0.01' : (100-(((data.diskSize-data.size)/data.diskSize)*100)).toFixed(2)}%`
        sizeCircleBorder.style.background = `radial-gradient(closest-side,  var(--window-main-background-color) 80%, transparent 85% 100%),
        conic-gradient(var(--window-fill-indicator-filled) ${(100-(((data.diskSize-data.size)/data.diskSize)*100)).toFixed(2) < 0.01 ? '0.05%' : (100-(((data.diskSize-data.size)/data.diskSize)*100)).toFixed(2)+'%'}, var(--window-fill-indicator-empty) 0)`
    }
    
})


window.api.updateDirSize((_, data)=>{
    sizeHolder.innerHTML = `Folder size ${formatBytes(data.size)}`
    fileCountHolder.innerHTML = `${data.files} files`
    folderCountHolder.innerHTML = `${data.folders} folders`
    sizeCircle.innerHTML = `${(100-(((propData.diskSize-data.size)/propData.diskSize)*100)).toFixed(2) < 0.01 ? '>0.01' : (100-(((propData.diskSize-data.size)/propData.diskSize)*100)).toFixed(2)}%`
    sizeCircleBorder.style.background = `radial-gradient(closest-side,  var(--window-main-background-color) 80%, transparent 85% 100%),
    conic-gradient(var(--window-fill-indicator-filled) ${(100-(((propData.diskSize-data.size)/propData.diskSize)*100)).toFixed(2) < 0.01 ? '0.05%' : (100-(((propData.diskSize-data.size)/propData.diskSize)*100)).toFixed(2)+'%'}, var(--window-fill-indicator-empty) 0)`
})
window.api.updateFinalDirSize((_, data)=>{
    console.log(data)
    sizeHolder.innerHTML = `Folder size ${formatBytes(data.size)}`
    fileCountHolder.innerHTML = `${data.files} files`
    folderCountHolder.innerHTML = `${data.folders} folders`
    sizeCircle.innerHTML = `${(100-(((propData.diskSize-size)/propData.diskSize)*100)).toFixed(2) < 0.01 ? '>0.01' : (100-(((propData.diskSize-data.size)/propData.diskSize)*100)).toFixed(2)}%`
    sizeCircleBorder.style.background = `radial-gradient(closest-side,  var(--window-main-background-color) 80%, transparent 85% 100%),
    conic-gradient(var(--window-fill-indicator-filled) ${(100-(((propData.diskSize-data.size)/propData.diskSize)*100)).toFixed(2) < 0.01 ? '0.05%' : (100-(((propData.diskSize-data.size)/propData.diskSize)*100)).toFixed(2)+'%'}, var(--window-fill-indicator-empty) 0)`
})