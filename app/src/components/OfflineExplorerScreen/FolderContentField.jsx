import React, { useEffect, useState } from 'react'


import OfflineTableFile from './OfflineTableFile'

export default function FolderContentField() {

    const [files, setFiles] = useState([])
    const [directory, setDirectory] = useState('')
    

    const getCurrentFilePath = async () =>{
        try {
            const path = await window.api.getCurrentFilePath()
            setDirectory(path)
            const resFiles = await window.api.getFilesFromPath(path)
            setFiles([...resFiles])
        } catch (error) {
            console.log(error)
        }
    }

    const goToNextFolder = async (file) =>{
        try {
            if(file.type === 'Folder'){
                const resFiles = await window.api.getFilesFromPath(`${directory}\\${file.name}`)
                setFiles([...resFiles])
                setDirectory(`${directory}\\${file.name}`)
                console.log(directory)
            }else {
                console.log('Fuck off')
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    const goToPrevFolder = async (path) => {
        try {
            const resFiles = await window.api.getFilesFromPath(getPrevDirectory(path))
            console.log(resFiles)
            console.log(getPrevDirectory(path))
            setDirectory(getPrevDirectory(path))
            setFiles([...resFiles])
        } catch (error) {
            console.log(error)
        }
    }

    const getPrevDirectory = (dir) => {
       let path =  dir.split('\\').slice(0, -1).join('\\')
       if (path.length <3) {
        path = path + '\\'
       }
       return path
    }

    useEffect(()=>{
        getCurrentFilePath()
    },[])

  return (
    <div className="folder_content_and_properties_container">
        <div className="properties_container">
        {directory.length !== 3 && <button className='returnButton' onClick={()=>{goToPrevFolder(directory)}}>Return to {getPrevDirectory(directory)}</button>}
        {directory.length>0 && <div>Dir: {directory}</div>}
        </div>
        <div className="folder_content_container">
            <div className="header_of_file_table">
                    <p className="name_h">Name</p>
                    <p className="type_h">Type</p>
                    <p className="date-created_h">Date (C)</p>
                    <p className="date-modified_h">Date (M)</p>
            </div>
            <div className="file_tabel">
                {files.length >0 ? files.map(file =>
                    <OfflineTableFile goToNextFolder={()=>{goToNextFolder(file)}} name={file.name.length > 25 ? file.name.slice(0,23)+'...' : file.name} type={file.type} date_c="02/08/2023" date_m="02/08/2023"/>
                )
                :<p>No file found</p>
                }
            </div>
        </div>
    </div>
  )
}
