import React, { useEffect, useState } from 'react'

import dividerArrow from 'Images/divider_arrow.png'

import OfflineTableFile from './OfflineTableFile'
import OfflineDisk from './OfflineDisk'
import { Scrollbar } from 'react-scrollbars-custom';


export default function FolderContentField() {

    const [files, setFiles] = useState([])
    const [directory, setDirectory] = useState('')
    const [coreDir, setCoreDir] = useState([])
    const [drives, setDrives] = useState([])

    const goToNextFolder = async (file) =>{
        try {
            if(file.type === 'Folder'){
                const resFiles = await window.api.getFilesFromPath(`${directory}\\${file.name}`)
                setFiles([...resFiles])
                setDirectory(`${directory}\\${file.name}`)
            }else {
                throw new Error({message:'Not a folder'})
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    const goToPrevFolder = async (path) => {
        try {
            const resFiles = await window.api.getFilesFromPath(getPrevDirectory(directory,path))
            setDirectory(getPrevDirectory(directory,path))
            setFiles([...resFiles])
            // console.log(JSON.stringify(resFiles))
            // console.log(resFiles)
        } catch (error) {
            console.log(error)
        }
    }
    const getPrevDirectory = (dir, folder) => {
        return dir.slice(0, dir.indexOf(folder)) + folder
     }
    
    const getStartingPath = async() =>{
        try {
            const drive = await window.api.getStartingPath()
            setDrives([...drive])
            const path = []
            for(let i = 0; i < drive.length; i++){
                drive[i].mountpoints.map(drive => path.push(drive))
            }
            setFiles([])
            setDirectory('')
            setCoreDir([...path])
        } catch (error) {
            console.log(error)
        }
    }
    const goToDisk = async (path) =>{
        try {
            if(path.length == 3){
                const resFiles = await window.api.getFilesFromPath(path.slice(0, -1))
                setCoreDir([])
                setDirectory(path)
                setFiles([...resFiles])
            }else {
                const resFiles = await window.api.getFilesFromPath(path)
                setCoreDir([])
                setDirectory(path)
                setFiles([...resFiles])
            } 
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        getStartingPath()
    },[])

  return (
    <div className="folder_content_and_properties_container">
        <div className="properties_container">
        <div className='nav_buttons_container'>
            <button onClick={()=>{goToPrevFolder(directory)}}>back</button>
            <button>next</button>
            <button>reload</button>
            <button>Go to</button>
        </div>
        <div className='info_and_properties_container'>
            <div className='path_container'>
            {directory.split('\\').length < 4 && <p onClick={()=> getStartingPath()}>This PC</p>}
            {directory.split('\\').length < 4 
            ?directory.split('\\').map((path, i)=>
                path.at(-1) === ':' 
                ? <p onClick={()=>goToDisk(path)}><img src={dividerArrow} alt="divide_arrow" />{path.slice(0, -1)}</p>
                : path.length !== 0 &&
                    <p onClick={()=>goToPrevFolder(path)}>
                        <img src={dividerArrow} alt="divide_arrow" />
                        {i+1 === directory.split('\\').length 
                        ? path.length > 15 ? path.slice(0,5)+`...` : path
                        : path.length > 6 ? path.slice(0,5)+`...` : path
                        }
                    </p>
                )
                :<>
                <p onClick={()=>goToDisk(directory.split('\\')[0])}>{directory.split('\\')[0].slice(0, -1)}</p>
                <p><img src={dividerArrow} alt="divide_arrow" />...</p>
                {directory.split('\\').slice(-2).map((path , i) =>
                    <p onClick={()=> goToPrevFolder(path)}>
                        <img src={dividerArrow} alt="divide_arrow" />
                        {/* {i === 1
                        ? path
                        : path.length > 6 ? path.slice(0,5)+`...` : path
                        } */}
                        {path.length > 6 ? path.slice(0,5)+`...` : path}
                    </p>
                    )}
                </>
                }
            </div>
            <div className='properties_buttons'>
                <button>view</button>
                <button>sorting</button>
                <button>Share</button>
                <button>Properties</button>
            </div>
        </div>
        </div> 
        <div className="folder_content_container" >
        {(coreDir.length === 0 && files.length > 0) &&
            <div className="header_of_file_table">
                <p className="name_h">Name</p>
                <p className="type_h">Type</p>
                <p className="date-created_h">Date (C)</p>
                <p className="date-modified_h">Date (M)</p>
            </div>
        }
            <div className="file_tabel">
                <Scrollbar style={{ width: "100%", height: "100%" }}>
                {coreDir.length > 0 
                ? <div className='disk_container'>
                    {coreDir.map(dir => <OfflineDisk diskDir={dir} disksInfo = {drives} goToDisk={()=>goToDisk(dir.path)}/>)}
                </div>  
                : files.length > 0 
                    ? files.map(file =><OfflineTableFile
                        file={file}
                        goToNextFolder={()=>{goToNextFolder(file)}} 
                        date_c={file.Stats !== undefined && JSON.stringify(file.Stats.ctime).split('T')[0].split('-').join('/').slice(1) }
                        date_m={file.Stats !== undefined && JSON.stringify(file.Stats.atime).split('T')[0].split('-').join('/').slice(1) }
                        />)
                    : <p className='info_no_files'>No files found</p>
                }
                </Scrollbar>
            </div>
        </div>
        <div className='fileinfo_down_display'><p>{(files.length >0 && coreDir.length == 0 ) ? files.length == 1 ? files.length + ' item' : files.length + ' items' : null}</p> {(files.length >0 && coreDir.length == 0 ) && <div></div>}</div>
    </div>
  )
}
