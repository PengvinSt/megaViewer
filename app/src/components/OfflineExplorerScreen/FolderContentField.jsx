import React, { useEffect, useState } from 'react'

import { Scrollbar } from 'react-scrollbars-custom';
import Modal from '../Modal/Modal.jsx'



import dividerArrow from 'Images/divider_arrow.png'
import OfflineTableFile from './OfflineTableFile'
import OfflineDisk from './OfflineDisk'
import hardDiskImg from 'Images/hard_disk.png'
import SystemDiskImg from 'Images/systemDisk.png'
import Folder from 'Images/folder.png'
import PC from 'Images/pc_icon.png'
import View from 'Images/view_button.svg'
import Sorting from 'Images/sorting_button.svg'
import Share from 'Images/share_button.svg'
import Property from 'Images/property_button.svg'
import Reload from 'Images/reload.svg'
import LeftArrow from 'Images/left_arrow.svg'
import RightArrow from 'Images/right_arrow.svg'
import UpArrow from 'Images/up_arrow.svg'
import MenuClose from 'Images/menu_icon_close.svg'
import MenuOpen from 'Images/menu_icon_open.svg'

import GroupLine from 'Images/group_line.svg'
import GroupSpred from 'Images/group_spred.svg'


import OfflineSpredFile from './OfflineSpredFile.jsx';



export default function FolderContentField() {
    const [files, setFiles] = useState([])
    const [directory, setDirectory] = useState('')
    const [coreDir, setCoreDir] = useState([])
    const [drives, setDrives] = useState([])
    const [prevDirectory, setPrevDirectory] = useState('')
    const [nextDirectory, setNextDirectory] = useState('')

    const [modalView, setModalView] = useState(false)

    const [hidenModal, setHidenModal] = useState(false)
    const [hidenModalView, setHidenModalView] = useState(false)

    const [showType, setShowType] = useState('in-line')
    const [isSorting, setIsSorting] = useState(false)
    const [sortType, setSortType] = useState('Folder')

    const goToNextFolder = async (file) =>{
        try {
            if(file.type === 'Folder'){
                const resFiles = await window.api.getFilesFromPath(`${directory}\\${file.name}`)

                //On testing
                const resFilteredFiles = resFiles.filter(file => file.Stats !== undefined && file)
                //On testing

                //temp REDO!!!
                if(isSorting){
                    tempSortingFunc(resFilteredFiles)
                }else{
                    setFiles([...resFilteredFiles])
                }
                //temp REDO!!!

                // setFiles([...resFilteredFiles])
                setPrevDirectory(directory)
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
            console.log(path, directory)
            const resFiles = await window.api.getFilesFromPath(getPrevDirectory(directory,path))

            //On testing
            const resFilteredFiles = resFiles.filter(file => file.Stats !== undefined && file)
            //On testing

            setNextDirectory(directory)
            setDirectory(getPrevDirectory(directory,path))
            // setFiles([...resFilteredFiles])
            
            //temp REDO!!!
                if(isSorting){
                    tempSortingFunc(resFilteredFiles)
                }else{
                    setFiles([...resFilteredFiles])
                }
            //temp REDO!!!

        } catch (error) {
            console.log(error)
        }
    }
    const getPrevDirectory = (dir, folder) => {
        return dir.slice(0, dir.indexOf(folder)) + folder
    }
    
    const upArrowFunc = () => {
        if(directory.length !== 0){
            if(directory.length > 4){
                if(directory.split('\\').filter(data=> data).length > 2){
                    goToPrevFolder(directory.split('\\').slice(-2)[0])
                }else {
                    goToDisk(directory.split('\\')[0])
                }
            }else {
                getStartingPath()
            }
        }
    }

    const reloadFunc = async () => {
        if(directory.length > 1){
            const resFiles = await window.api.getFilesFromPath(directory)

            //On testing
            const resFilteredFiles = resFiles.filter(file => file.Stats !== undefined && file)
            //On testing

            // setFiles([...resFilteredFiles])

            //temp REDO!!!
            if(isSorting){
                tempSortingFunc(resFilteredFiles)
            }else{
                setFiles([...resFilteredFiles])
            }
            //temp REDO!!!

        }else {
            location.reload()
        }
    }

    const prevDirectoryArrowFunc = async () => {
        
        if(prevDirectory.length > 0){
            setCoreDir([])
            const resFiles = await window.api.getFilesFromPath(prevDirectory)
            
            //On testing
            const resFilteredFiles = resFiles.filter(file => file.Stats !== undefined && file)
            //On testing
            
            // setFiles([...resFilteredFiles])

           //temp REDO!!!
            if(isSorting){
                tempSortingFunc(resFilteredFiles)
            }else{
                setFiles([...resFilteredFiles])
            }
            //temp REDO!!!

            setNextDirectory(directory)
            setDirectory(prevDirectory)
            setPrevDirectory('')
        }
    }

    const nextDirectoryArrowFunc = async ()=> {
        if(nextDirectory.length > 0){
            setCoreDir([])
            const resFiles = await window.api.getFilesFromPath(nextDirectory)

            //On testing
            const resFilteredFiles = resFiles.filter(file => file.Stats !== undefined && file)
            //On testing
            
            // setFiles([...resFilteredFiles])

           //temp REDO!!!
            if(isSorting){
                tempSortingFunc(resFilteredFiles)
            }else{
                setFiles([...resFilteredFiles])
            }
            //temp REDO!!!

            setPrevDirectory(directory)
            setDirectory(nextDirectory)
            setNextDirectory('')
        }
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

                //On testing
                const resFilteredFiles = resFiles.filter(file => file.Stats !== undefined && file)
                //On testing

                setCoreDir([])
                setDirectory(path)
                // setFiles([...resFilteredFiles])

                //temp REDO!!!
                if(isSorting){
                    tempSortingFunc(resFilteredFiles)
                }else{
                    setFiles([...resFilteredFiles])
                }
                //temp REDO!!!

            }else {
                const resFiles = await window.api.getFilesFromPath(path)

                //On testing
                const resFilteredFiles = resFiles.filter(file => file.Stats !== undefined && file)
                //On testing

                setCoreDir([])
                setDirectory(path)
                // setFiles([...resFilteredFiles])

                //temp REDO!!!
                if(isSorting){
                    tempSortingFunc(resFilteredFiles)
                }else{
                    setFiles([...resFilteredFiles])
                }
                //temp REDO!!!

            } 
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        getStartingPath()
    },[])

    //temp!!!!!!!!!!

    const tempSortingFunc = (sortingFiles,isChanged = false) => {
        if(files !== undefined){
            setIsSorting(true)
            if(sortType === 'Folder'){
                const sortFiles = sortingFiles.sort((x,y)=>x.type === 'File' ? 1 : y.type === 'File' ? -1 : 0)
                setFiles([...sortFiles])
                if(isChanged){
                    setSortType('Files')
                }
                // console.log('Folder=>File', isChanged,sortType)
            }else {
                const sortFiles = sortingFiles.sort((x,y)=>x.type === 'Folder' ? 1 : y.type === 'Folder' ? -1 : 0)
                setFiles([...sortFiles])
                if(isChanged){
                    setSortType('Folder')
                }
                // console.log('File=>Folder',isChanged,sortType)
            }
            // setFiles([...sortingFiles])
            // console.log('sorting...',sortingFiles)
        }
    }

    //temp!!!!!!!!!!
  return (
    <div className="folder_content_and_properties_container">
        <div className="properties_container">
        <div className='nav_buttons_container'>
            <button onClick={()=>{prevDirectoryArrowFunc()}} style={{background:prevDirectory.length === 0 && 'background:var(--offlineExplorer-main-background-color)'}}><img src={LeftArrow} alt="nav arrow" style={{ filter: prevDirectory.length === 0 && 'var(--offlineExplorer-not-interractive-svg)'}}/></button>
            <button onClick={()=>{nextDirectoryArrowFunc()}} style={{background:nextDirectory.length === 0 && 'background:var(--offlineExplorer-main-background-color)'}}><img src={RightArrow} alt="nav arrow" style={{ filter: nextDirectory.length === 0 && 'var(--offlineExplorer-not-interractive-svg)'}}/></button>
            <button onClick={()=>{upArrowFunc()}} style={{background:directory.length === 0 && 'background:var(--offlineExplorer-main-background-color)'}}><img src={UpArrow} alt="nav arrow" style={{ filter: directory.length === 0 && 'var(--offlineExplorer-not-interractive-svg)'}}/></button>
            <button onClick={()=>{reloadFunc()}}><img src={Reload} alt="nav arrow"/></button>
        </div>
        <div className='info_and_properties_container'>
            <div className='path_container'>
                {directory.length < 4
                    ? directory.length === 0 ? <img src={PC} alt="System representation" className='folder_representation'/> : <img src={(directory === 'C:\\\\' || directory === 'C:\\' || directory === 'C:') ? SystemDiskImg : hardDiskImg} alt="Disk representation" className='folder_representation'/>
                    :<img src={Folder} alt="Folder representation" className='folder_representation'/>
                }
                <div className='intaractive_path'>
                    {directory.length < 4
                    ? <div className='start_path_container'>
                        <p className={directory.length !== 0 ? 'this_pc' : undefined} onClick={()=> getStartingPath()}>This PC</p> 
                        {directory.length !== 0 && 
                        <>
                        <img src={dividerArrow} alt="divide_arrow" />
                        <p>Local Disk {directory.length === 2 ? directory.slice(0,-1): directory.slice(0,-2)}</p>
                        </>
                        }
                      </div>
                    : <>
                        <h1>{directory.split('\\').slice(-1)[0].length > 25 ? directory.split('\\').slice(-1)[0].slice(0,10)+`...` : directory.split('\\').slice(-1)[0]}</h1>
                        <div className='intaractive_path_inner_div'>
                        {directory.split('\\').length < 4 
                            ? directory.split('\\').map((path, i)=>
                                path.at(-1) === ':' 
                                ? <p onClick={()=>{setNextDirectory(directory);goToDisk(path)}}>{path.slice(0, -1)}</p>
                                    : path.length !== 0 &&
                                        <p onClick={()=>goToPrevFolder(path)}>
                                            <img src={dividerArrow} alt="divide_arrow" />
                                            {i+1 === directory.split('\\').length 
                                            ? path.length > 25 ? path.slice(0,10)+`...` : path
                                            : path.length > 10 ? path.slice(0,5)+`...` : path
                                            }
                                        </p>)
                            :<>
                                <p onClick={()=>{setNextDirectory(directory);goToDisk(directory.split('\\')[0])}}>{directory.split('\\')[0].slice(0, -1)}</p>
                                <p><img src={dividerArrow} alt="divide_arrow" />...</p>
                                {directory.split('\\').slice(-2).map((path , i) =>
                                    <p onClick={()=> goToPrevFolder(path)}>
                                        <img src={dividerArrow} alt="divide_arrow" />
                                        {i+3 === directory.split('\\').length 
                                            ? path.length > 25 ? path.slice(0,10)+`...` : path
                                            : path.length > 10 ? path.slice(0,5)+`...` : path
                                        }
                                    </p>
                                )}
                            </>
                        }
                        </div>
                    </>
                    }
                    
                </div>
            </div>
            <div className='properties_buttons'>
                <div className='properties_buttons_visible'>
                    <button onClick={()=>{setModalView(!modalView)}}><img src={View} alt="view image" /> view</button>
                    <button onClick={()=>isSorting? tempSortingFunc(files,true) : tempSortingFunc(files)}><img src={Sorting} alt="sorting image" /> sorting</button>
                    <button><img src={Share} alt="share image" /> Share</button>
                    <button><img src={Property} alt="property image" /> Properties</button>
                    <Modal visible={modalView} setVisible={setModalView} params={{background:false, type:'right', spec:'prop_buttons_view'}}>
                    <button onClick={()=>{setShowType('in-line');setModalView(!modalView)}} style={{background:showType === 'in-line' ? 'var(--offlineExplorer-main-button-background-color-hover)' : 'var(--offlineExplorer-main-button-background-color)', color: showType === 'in-line' ? 'var(--offlineExplorer-main-button-font-color-hover)' : 'var(--offlineExplorer-main-button-font-color)'}}><img src={GroupLine} alt="group" style={{filter:showType === 'in-line' ? 'var(--offlineExplorer-main-button-image-hover-color-svg)' : undefined}}/> In line</button>
                    <button onClick={()=>{setShowType('spred');setModalView(!modalView)}} style={{background:showType === 'spred' ? 'var(--offlineExplorer-main-button-background-color-hover)' : 'var(--offlineExplorer-main-button-background-color)', color: showType === 'spred' ? 'var(--offlineExplorer-main-button-font-color-hover)' : 'var(--offlineExplorer-main-button-font-color)'}}><img src={GroupSpred} alt="group" style={{filter:showType === 'spred' ? 'var(--offlineExplorer-main-button-image-hover-color-svg)' : undefined}}/> Spred</button>
                    </Modal>
                </div>
                <div className='properties_buttons_hiden' onClick={()=>{setHidenModal(!hidenModal)}}>
                    <button className='menu_hidden_button'><img src={hidenModal ? MenuClose : MenuOpen} alt="Menu icon" /></button>
                    <Modal visible={hidenModal} setVisible={setHidenModal} params={{background:false, type:'right', spec:'prop_buttons_hiden'}}>
                        <button onClick={()=>{setHidenModalView(!hidenModalView)}}><img src={View} alt="view image" /> view</button>
                        <button><img src={Sorting} alt="sorting image" /> sorting</button>
                        <button><img src={Share} alt="share image" /> Share</button>
                        <button><img src={Property} alt="property image" /> Properties</button>
                        <Modal visible={hidenModalView} setVisible={setHidenModalView} params={{background:false, type:'right', spec:'prop_buttons_view_hiden'}}>
                            <button onClick={()=>{setShowType('in-line');setHidenModalView(!hidenModalView);setHidenModal(!hidenModal)}} style={{background:showType === 'in-line' ? 'var(--offlineExplorer-main-button-background-color-hover)' : 'var(--offlineExplorer-main-button-background-color)', color: showType === 'in-line' ? 'var(--offlineExplorer-main-button-font-color-hover)' : 'var(--offlineExplorer-main-button-font-color)'}}><img src={GroupLine} alt="group" style={{filter:showType === 'in-line' ? 'var(--offlineExplorer-main-button-image-hover-color-svg)' : undefined}}/> In line</button>
                            <button onClick={()=>{setShowType('spred');setHidenModalView(!hidenModalView);setHidenModal(!hidenModal)}} style={{background:showType === 'spred' ? 'var(--offlineExplorer-main-button-background-color-hover)' : 'var(--offlineExplorer-main-button-background-color)', color: showType === 'spred' ? 'var(--offlineExplorer-main-button-font-color-hover)' : 'var(--offlineExplorer-main-button-font-color)'}}><img src={GroupSpred} alt="group" style={{filter:showType === 'spred' ? 'var(--offlineExplorer-main-button-image-hover-color-svg)' : undefined}}/> Spred</button>
                        </Modal>
                    </Modal>
                </div>
            </div>
        </div>
        </div> 
        <div className="folder_content_container" >
        {(coreDir.length === 0 && files.length > 0 && showType === 'in-line') &&
            <div className="header_of_file_table">
                <p className="name_h">Name</p>
                <p className="type_h">Type</p>
                <p className="date-created_h">Date (C)</p>
                <p className="date-modified_h">Date (M)</p>
            </div>
        }
            <div className="file_tabel">
                
                {coreDir.length > 0 
                ?<Scrollbar style={{ width: "100%", height: "100%" }} noScrollX> 
                        <div className='disk_container'>
                            {coreDir.map((dir, i )=> <OfflineDisk key={i} diskDir={dir} disksInfo = {drives} goToDisk={()=>goToDisk(dir.path)}/>)}
                        </div> 
                    </Scrollbar> 
                : showType === 'in-line' 
                ?<Scrollbar style={{ width: "100%", height: "100%" }} noScrollX>
                    {files.length > 0 
                        ? files.map((file, i) =><OfflineTableFile
                            file={file}
                            goToNextFolder={()=>{goToNextFolder(file)}} 
                            date_c={file.Stats !== undefined && JSON.stringify(file.Stats.ctime).split('T')[0].split('-').join('/').slice(1) }
                            date_m={file.Stats !== undefined && JSON.stringify(file.Stats.atime).split('T')[0].split('-').join('/').slice(1) }
                            key={i}
                            />)
                        : <p className='info_no_files'>No files found</p>}
                 </Scrollbar>   
                : showType === 'spred' && 
                <Scrollbar style={{ width: "100%", height: "100%" }} noScrollX>
                <div className='spred_files_container'>
                    
                    {files.length > 0 
                        ? files.map((file, i) =><OfflineSpredFile
                            file={file}
                            goToNextFolder={()=>{goToNextFolder(file)}} 
                            date_c={file.Stats !== undefined && JSON.stringify(file.Stats.ctime).split('T')[0].split('-').join('/').slice(1) }
                            date_m={file.Stats !== undefined && JSON.stringify(file.Stats.atime).split('T')[0].split('-').join('/').slice(1) }
                            key={i}
                            />)
                        : <p className='info_no_files'>No files found</p>}
                    
                </div>
                </Scrollbar>
                }
            </div>
        </div>
        <div className='fileinfo_down_display'><p>{(files.length >0 && coreDir.length == 0 ) ? files.length == 1 ? files.length + ' item' : files.length + ' items' : null}</p> {(files.length >0 && coreDir.length == 0 ) && <div></div>}</div>
    </div>
  )
}
