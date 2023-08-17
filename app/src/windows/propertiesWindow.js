const closeButton = document.getElementById('close_button')


const nameHolderAndInput = document.getElementById('name_input')
const typeHolder = document.getElementById('type')
const pathHolder = document.getElementById('path')
const sizeHolder = document.getElementById('size') 
const folderCountHolder = document.getElementById('folders_count') 
const fileCountHolder = document.getElementById('files_count') 

closeButton.addEventListener('click', () =>{
    window.api.closePropWindow()
})
document.addEventListener('DOMContentLoaded', async ()=>{
    const data = await window.api.getWindowData()
    console.log(data)

    if(data.name){
        nameHolderAndInput.placeholder = data.name
    }
    
    pathHolder.innerHTML = data.path.replace('\\', '/')
    typeHolder.innerHTML = data.type
    if(data.type === 'Folder'){
        fileCountHolder.innerHTML = `${data.filesCount} files`
        folderCountHolder.innerHTML = `${data.foldersCount} folders`
        sizeHolder.innerHTML = `Folder size ${data.size}`
    }
    sizeHolder.innerHTML = `File size ${data.size}`
})

// const data = {
//     path:directory,
//     type:'Folder',
//     folders:isAppear(files,'Folder',true,"type"),
//     files:isAppear(files,'File',true,"type"),
//     size:'NaN'
// }